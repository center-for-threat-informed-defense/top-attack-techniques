<template>
    <div class="container-body text-left">
        <p>{{ methodologyList[activeItemId].description }}</p>
        <div v-if="activeItemId === 0">
            <h3>Why we include actionability</h3>
            <p>It’s important to understand how a defender can take action to protect themselves against a specific
                technique. Depending on the number of publicly available detections and mitigations per technique, this
                allows the defender the ability respond to an incident faster, or to prevent the incident all together.
            </p>
            <h3>Finding Actionability</h3>
            <p>We broke down actionability into two categories: detections and mitigations. </p>
            <p>For detections, we reviewed several publicly available analytic resources and mapped each of them to
                ATT&CK. The repositories we used were <a href="https://car.mitre.org/" target="_blank">MITRE’s Cyber
                    Analytic Repository</a>, <a href="https://github.com/elastic/detection-rules"
                    target="_blank">Elastic</a>, <a href="https://github.com/SigmaHQ/sigma" target="_blank">Sigma HQ's
                    rules</a>, and <a href="https://research.splunk.com/detections/" target="_blank">Splunk
                    Detections</a>.

            </p>
            <p>For mitigations, we reviewed security controls from two publicly available repositories and mapped each
                of them to ATT&CK. The repositories we used were <a href="https://www.cisecurity.org/controls"
                    target="_blank">CIS Critical Security Controls</a> and <a
                    href="https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" target="_blank">NIST 800-53 Security
                    Controls</a>.
            </p>
            <p>We then made a total count of all detections and mitigations available for each ATT&CK technique.
                Techniques that have a greater number of detections and mitigations are weighted more heavily than those
                with a lower number. If a technique has a limited number of ways to detect or protect against it, we
                believe defending against those techniques will provide diminishing returns and more attention should be
                placed elsewhere.</p>
            <p>For instance, <a href="https://attack.mitre.org/techniques/T1014/" target="_blank">T1014: Rootkit</a> has
                zero detections or mitigations in the repositories that we referenced.
                Since rootkits are better identified by heuristics and forensics than analytics and security controls, a
                disproportionate number of resources would need to be used to detect or prevent against them. Those
                resources could be better allocated to defending against techniques that are more easily detected, but
                just as dangerous.</p>
            <p>There are a few limitations to this methodology. First, we did not search each repository to see if each
                analytic or control was still valid or if there were duplicates. Second, we did not differentiate for
                analytics that are similarly related. For instance, an analytic looking for Powershell executing an
                encoded command and one for Powershell executing Mimikatz would both count for T1053 (command and
                scripting interpreter). We tried to account for these limitations by setting upper bounds. After a
                certain point, the value of each additional analytic and control does not provide the same value to the
                defender. Because of this, any detections and controls over 100 and 55, respectively, do not change the
                weighted list.</p>
            <p>Finally, we recognize that for some, defending against rootkits, or other similarly stealthy techniques,
                is just as, if not more, important than other techniques. We tried to account for this by allowing users
                to choose which analytics and controls should be included in the weighted list.</p>
            <p class="text-center italic">Insert figure 1</p>
            <p>You can see there are quite a few outliers, especially for detections. Keep in mind that there are known
                to be duplicates, so there is likely some double counting.</p>

            <h3>Framing the Analysis</h3>
            <p>This approach is based on techniques for "Multiple-criteria decision-making."</p>
            <h4>Attribute Utilities</h4>
            <p>Each technique has two attributes for determining actionability: the number of available detections, and
                the number of available mitigations. In order to combine them into a single score, we'll need to
                normalize using a "utility" function 𝑢 for each of these attributes. This will map the value of an
                attribute to a number between 0 and 1 which indicates how much that value contributes to actionability.
            </p>
            <p>For simplicity and interpretability, we recommend using a piecewise linear utility function, like this:
            </p>
            <img src="../assets/methodology/actionability/figure2.svg" class="mx-auto my-2" />

            <p>Here, <em>x</em> is the value of some attribute (ex: # mitigations), <em>upper</em> and <em>lower</em>
                are the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have zero utility,
                values above the upper cutoff have maximum utility.</p>

            <p>For example, if 130 detection methods are not much more "valuable" than 100, then we may consider
                specifying an upper cutoff of 100 for detections. Conversely, if 10 detection methods aren't much more
                valuable than 0 methods then we might set the lower cutoff to be 10. Moreover, using cutoffs like this
                will prevent cases where a technique has a very large number of detections but absolutely no mitigations
                might still get a high actionability score.
            </p>
            <p>[notes: upper cutoff should be no larger than the largest value for its attribute, and lower cutoff
                should
                be no lower than the smallest value for its attribute]</p>
            <p>Bottom line: For each attribute (# detections and # mitigations), set the lower cutoff to the smallest
                value that "usefully" contributes to actionability (default to the lowest value), and set the upper
                cutoff to the largest value that "usefully" contributes to actionability (default to something close to
                the largest value).</p>
            <p> These cutoffs need to be specified for multiple reasons:</p>
            <ul>
                <li>In order to combine mitigations and detections into a single function, they must both be on the same
                    scale. If we were to scale them according to the smallest and largest values for each, then the
                    scaling would be determined by the (likely double-counted) outliers</li>
                <li>Prevent a technique with no mitigations but many detections from receiving an inflated actionability
                    score</li>
                <li>Prevent the weighting from changing when new data (potentially a very large outlier) gets added</li>
            </ul>
            <p>For example scores, the cutoffs are 0 and 100 for detections, and 0 and 55 for mitigations.</p>
            <p>Examples of potential utility functions are illustrated below:</p>
            <p class="text-center italic">Insert figure 3</p>
            <h4>Defining Attribute Weighting</h4>
            <p>We then define weights for each of the attributes to rank their importance. Once we have the weights
                defined, the Actionability score is computed as:</p>
            <img src="../assets/methodology/actionability/figure4.svg" class="mx-auto my-2" />
            <p> so in our case with number of detections and number of mitigations as our attributes, it will be:</p>
            <img src="../assets/methodology/actionability/figure5.svg" class="mx-auto my-2" />
            <p>Where <em>xd</em> and <em>xm</em> are the raw counts of detections and mitigations, <em>wd</em> and
                <em>wm</em> are their weights, and <em>ud</em> and <em>um</em> are their utility functions.

            </p>
            <p>Since we are using utility functions, we need to be careful with how we define the weights.</p>
            <p>Bottom line: to make sure the weights have a "physical" meaning, we will define them using weighting
                ratios</p>
            <img src="../assets/methodology/actionability/figure6.svg" class="mx-auto my-2" />
            <p>If we want 1 mitigation to be worth 2 detections, then we'd set <img
                    src="../assets/methodology/actionability/figure6.svg" class="inline -mt-2" /> =2. This method can
                be extended to problems with more than two attributes.
            </p>
            <h4>How to Get Weights from Weighting Ratios</h4>
            <p>The actionability formula is: <img src="../assets/methodology/actionability/figure5.svg"
                    class="inline" />. If <img src="../assets/methodology/actionability/figure7.svg" class="inline" />
                (i.e. they are both in the main "linear domain") then we can write this as:
            </p>
            <img src="../assets/methodology/actionability/figure8.svg" class="mx-auto my-2" />

            <p>If we want each mitigation to be worth two detections, then we should set the <em>wm</em> and <em>wd</em>
                so that the following relation is satisfied (if the ratio is changed, then you would change the 2 here
                to whatever the new ratio is): <img src="../assets/methodology/actionability/figure9.svg"
                    class="inline" />. The derivatives of A are: </p>
            <img src="../assets/methodology/actionability/figure10.svg" class="mx-auto my-2" />

            <p> When we plug these into the above relation, we see that the relation to be satisfied becomes <img
                    src="../assets/methodology/actionability/figure11.svg" class="inline" />. So we can set 𝑤𝑚:=1 and
                use the above relations to find a value for <em>wd</em>.</p>
            <img src="../assets/methodology/actionability/figure12.svg" class="mx-auto my-2" />
            <p>Then, to ensure actionability ranges from zero to one, we just need to normalize the weights so that they
                add up to one (i.e. we want <em>wd</em> + <em>wm</em> = 1.) We can do this by dividing each
                un-normalized weight by
                the sum of all weights: <img src="../assets/methodology/actionability/figure13.svg" class="inline" />
                and <img src="../assets/methodology/actionability/figure14.svg" class="inline" />
                where <em>w'm</em> and <em>w'd</em> are the values of <em>wm</em> and <em>wd</em> before normalizing.
            </p>

            <h4>What if we have more than two attributes?</h4>
            <p>For actionability we may want to incorporate some weighting for the number of ATT&CK datasources each
                technique has. Furthermore, this method might be used for one of the other scores, which may have more
                than two attributes. It is not too difficult to generalize this to work with three or more attributes.
            </p>
            <p>Suppose we have 5 attributes, named 𝑎, 𝑏, 𝑐, 𝑑, and 𝑒, and each attribute has an upper and lower
                cutoff. The steps to defining their weights are:</p>
            <ol class="list-decimal pl-6">
                <li>Make a "hierarchy" of attributes by importance</li>
                <ul>
                    <li>Example: e > [a,b] > d > c</li>
                </ul>
                <li>For each "level", define the weighting ratios</li>
                <ul>
                    <li>Example: <img src="../assets/methodology/actionability/figure15.svg" class="inline" /></li>
                </ul>
                <li>Set highest level's weights to 1 and use ratios to set the weights for the lower levels according to
                    <img src="../assets/methodology/actionability/figure16.svg" class="inline" />
                </li>

                <ul>
                    <li>Example: <img src="../assets/methodology/actionability/figure17.svg" class="inline" /></li>
                </ul>
                <li>Adjust the weights with each attribute's cutoffs according to <img
                        src="../assets/methodology/actionability/figure18.svg" class="inline" /></li>
            </ol>

            <p>This is a contour plot of actionability scores -- patches of the same color have (roughly) the same value
                of actionability</p>
            <ul>
                <li>Actionability ranges from zero to one. This will make things much easier when it comes time to
                    combine
                    the scores from actionability, chokepoint and so on.</li>
                <li>You can see that the highest score that a technique with no mitigations can have is about 0.45</li>
            </ul>
            <p class="text-center italic">Insert figure 19</p>
            <p> Here's what actionability would look like if we didn't use utility functions to scale detections and
                mitigations. We can see that actionability is now unbounded, which will make things difficult to combine
                later on. Also, even if a technique has zero mitigations, it could still receive a high actionability
                score if its detections is high enough.</p>
            <p class="text-center italic">Insert figure 20</p>
        </div>
        <div v-if="activeItemId === 1">
            <h3>Why we include choke points</h3>
            <p>Analyzing chokepoints can assist defenders to pinpoint critical techniques needed to be successful in an
                attack. These techniques serve as a common denominator amongst in otherwise disparate attacks. For
                instance, T1047 (WMI) can serve as a choke point because there are a many other techniques that can be
                executed after an adversary executes WMI. Defending against malicious WMI usage can limit the potential
                attack path that an adversary might have used.</p>

            <h3>Finding Choke Points</h3>
            <p>We subjectively analyzed open-source threat reports and cyber incidents to identify techniques that had
                many techniques achieve multiple objectives, and common techniques that had many other techniques
                leading up to it and happening after it. We created one-to-many, many-to-one, and many-to-many mappings
                to help us find out choke points. ATT&CK Tactics were first used to narrow scope and help determine
                likelihood of chokepoint techniques. The team defined preceding and subsequent techniques for each
                chokepoint. Total count of preceding and subsequent techniques is assigned an attribute. The attribute
                is the confidence level, confidence level is the technique’s probability to offer more avenues for a
                successful attack.</p>
            <h5>Future Recommendations:</h5>
            <p> In depth chokepoint analysis may require ML/AI components to visualize and predict all viable paths an
                attacker could take. An attack graph would display a representation of paths an adversary has
                successfully achieved a goal. At a high level, a type of representation would resemble a web where
                techniques branch out and co-occurrences can be identified. The attack graph can implement user’s
                implemented controls to better define what pathways are more likely to be explored by an attacker. As
                this project matures, the Center will look to incorporate <a
                    href="https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/our-work/attack-flow/"
                    target="_blank">ATT&CK Flow</a> data into this methodology. </p>
            <h5>Limitations:</h5>
            <p>The method we used to find choke points is highly subjective. Our analysis was done by manually examining
                each technique, searching for references in CTI, and identifying before and after techniques. </p>
            <h3>Framing the Analysis</h3>
            <p>To help limit the scope of techniques to review, the team first looked at MITRE ATT&CK Tactics that could
                potentially produce low Choke Point confidence levels. Tactics at the beginning and end of a cyber kill
                chain would not have many before and after techniques to produce high probability of an effective attack
                flow. Techniques under the Reconnaissance and Resource Development Tactics received a baseline of 0:1 to
                indicate at least one technique would take place after them. Techniques under the Impact Tactic received
                a baseline of 1:0 indicating at least one technique had taken place prior to them. Impact techniques are
                scoped as the adversary's cumulative objective so follow-on techniques were not considered. All other
                Tactics received a 1:1 baseline as at least one technique would occur before and after their
                facilitation.</p>
            <p>The MITRE team considered choke point to be the middle technique where many other techniques could go
                into and come out of in an attack flow proceeding. </p>
            <p class="text-center italic">Insert figure 1</p>
            <p><a href="https://attack.mitre.org/techniques/T1055/" target="_blank">T1055: Process Injection</a> is a
                great example of many techniques calling Process Injection as the next technique in succession for the
                cyber attack then proceeding to any number of other techniques afterwards.</p>
            <p class="text-center italic">Insert figure 2</p>
            <p><a href="https://attack.mitre.org/techniques/T1491/" target="_blank">T1491: Defacement</a> is a great
                example of how only one technique could funnel into another and there wouldn’t be a following technique
                after Defacement.</p>
            <p>By utilizing the same equation as Actionability, this allows us to understand and interpret the
                confidence level of choke point and to set parameters. This method is much clearer to see what the
                inputs are and how changing them will change the output. This method also does not make any assumptions
                about the structure of the connections between techniques beyond the data that was initially used.</p>
            <p>The chokepoint formula for a technique is written as <img
                    src="../assets/methodology/choke-point/figure3.svg" class="inline -mt-1" /></p>
            <p> Here 𝑥𝑏 and 𝑥𝑎 are the number of before and after techniques for the technique in question, while
                𝑢𝑏 and 𝑢𝑎 are their "utility" functions. Finally, 𝑤𝑏 and 𝑤𝑎 are the weights for before and after
                techniques, which are define further below using relative weighting ratios.</p>
            <h4>Utility Functions</h4>
            <p>For each potential chokepoint, we have two attributes: the number of before techniques it has, and the
                number of after techniques it has. In order to combine them, we define "utility" functions 𝑢𝑏 and 𝑢𝑎
                for # before and # after, respectively. These functions define the "value" as:</p>
            <img src="../assets/methodology/actionability/figure2.svg" class="mx-auto my-2" />
            <p>Where 𝑥 is the value of some attribute (ex: # of before techniques), and 𝑢𝑝𝑝𝑒𝑟 and 𝑙𝑜𝑤𝑒𝑟 are
                the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have zero utility,
                values above the upper cutoff have maximum utility. We set these to the smallest "useful" number of
                before or after techniques</p>
            <p>[note: the upper cutoff should be no larger than the largest value for its attribute, and the lower
                cutoff should be no lower than the smallest value for its attribute.]</p>
            <p>Examples of potential utility functions are illustrated below:</p>
            <p class="text-center italic">Insert figure 4</p>
            <h4>Attribute Weighting</h4>
            <p>We define the weights 𝑤𝑏 and 𝑤𝑎 by a "weighting ratio" which is set by asking how many after
                techniques is "worth" one before technique: <img src="../assets/methodology/choke-point/figure5.svg"
                    class="inline -mt-1" /> the number of after techniques worth one before technique</p>
            <p>If you want them to be weighted equally, set this equal to 1. If you want before techniques to be worth
                1.2 after techniques, set this equal to 1.2. Below is how to go from this ratio to the actual weights
                𝑤𝑏 and 𝑤𝑎.</p>
            <p>First, we find the un-normalized weights 𝑤′𝑏 and 𝑤′𝑎. Set</p>
            <img src="../assets/methodology/choke-point/figure6.svg" class="mx-auto my-2" />

            <p>Then normalize so that they add up to 1 to get the actual weights: <img
                    src="../assets/methodology/choke-point/figure7.svg" class="inline -mt-1" /></p>
            <p> Here is how the expression for 𝑤′𝑏 and 𝑤′𝑎 was derived:</p>
            <p>The chokepoint formula is <img src="../assets/methodology/choke-point/figure3.svg"
                    class="inline -mt-1" />. if
                𝑙𝑜𝑤𝑒𝑟𝑏 ≤ 𝑥𝑏 ≤ 𝑢𝑝𝑝𝑒𝑟𝑏 and 𝑙𝑜𝑤𝑒𝑟𝑎 ≤ 𝑥𝑎 ≤ 𝑢𝑝𝑝𝑒𝑟𝑎 (i.e. they are both in the
                main "linear domain") then we can write this as:</p>
            <img src="../assets/methodology/choke-point/figure8.svg" class="mx-auto my-2" />
            <p>In order to be weighted according to the ratio we specified, the weights 𝑤𝑏 and 𝑤𝑎 should be set so
                that the following relation is satisfied: <img src="../assets/methodology/choke-point/figure9.svg"
                    class="inline -mt-1" /></p>
            <p>The derivatives of <em>C</em> are: <img src="../assets/methodology/choke-point/figure10.svg"
                    class="inline -mt-1" /></p>
            <p>When we plug these into the above relation, we see that the relation to be satisfied becomes:</p>
            <img src="../assets/methodology/choke-point/figure11.svg" class="mx-auto my-2" />
            <p> So we can set 𝑤𝑏:=1 and use the above relations to find a value for 𝑤𝑎.</p>
            <h3>Plotting Chokepoint</h3>
            <p>We can make a scatter plot of the number of before and after techniques among the potential chokepoints:
            </p>
            <p class="text-center italic">Insert figure 12</p>
            <p>And we can overlay this with a contour plot of the actual chokepoint function (patches of the same color
                have roughly the same chokepoint score)</p>
            <p class="text-center italic">Insert figure 13</p>
            <p> and we can compare this with a plot of what the chokepoint function would look like had we not used
                utility functions to scale the number of before and after techniques</p>
            <p class="text-center italic">Insert figure 14</p>
        </div>
        <div v-if="activeItemId === 2">
            <h3>Why we Include Prevalence</h3>
            <p>This methodology allows us to see which techniques are actually being observed during cyber intrusions.
                With this knowledge, defenders can tailor their detection tools to look for those techniques that have
                the highest frequency and are the most current.</p>
            <p>The prevalence methodology is populated with data from the <a
                    href="https://mitre-engenuity.org/cybersecurity/center-for-threat-informed-defense/our-work/sightings-ecosystem/"
                    target="_blank">Sightings Ecosystem</a>. Each Sighting represents one or more ATT&CK techniques used
                by an adversary on (or to target) victim infrastructure.</p>
            <p>There are a few limitations with our data that are important to understand. First, our data is limited to
                the data that was shared with us by our contributors. This data is not all-inclusive and is not
                representative of all attacks around the world. Second, our data is scoped from 1 April, 2019 to 31
                July, 2021. Finally, our data is limited to how our contributors map data to ATT&CK. It is unclear if an
                increase in a certain technique means that it occurred more often or if it was detections simply
                improved.</p>
            <p>When looking at our data, it is important to remember that defending against our most observed techniques
                will not protect you from all adversary activity. It will only protect you from the adversary activity
                most observed by Sightings contributors. Despite these barriers, the Sightings data has given great
                insights into techniques that are frequently used by adversaries and its inclusion in our Top ATT&CK
                Techniques methodologies is helps insert real-world data into our analysis.</p>
            <h3>Framing the Analysis</h3>
            <p>For a technique that has attack times {t0, t1, … , tn}, we calculate the technique’s un-normalized
                prevalence score as: <img src="../assets/methodology/prevalence/figure1.svg" class="inline -mt-1" />
                Where 𝑤 is the time weighting function which assigns a weight (between zero and one) to an attack based
                on its proximity to the present time (𝑡𝑛𝑜𝑤). It is defined by:</p>
            <img src="../assets/methodology/prevalence/figure2.svg" class="mx-auto my-2" />
            <p>Here, Δ𝑡 is the time between the attack and the present time. We have three parameters in the weighting
                function that can be adjusted:</p>
            <ul>
                <li><em>full</em> is the number of days into the past (relative to the present) for which we want
                    attacks to be given full weighting. The weighting of attacks will start to decline if they occur
                    more than <em>full</em> days into the past
                </li>
                <li><em>decline</em> is the number of days after <em>full</em> has been reached over which the weighting
                    decreases to its minimum value. This controls the "steepness" of the falloff
                </li>
                <li><em>𝑤𝑚𝑖𝑛</em> is the minimum weight an attack can have. Attacks that occurred more than
                    <em>full</em>+<em>decline</em> days into the past will have a weighting of <em>𝑤𝑚𝑖𝑛</em>. This
                    controls the "strength" of the weighting
                </li>
            </ul>
            <p>The combination of these three parameters controls the strength and rate of weighting. For example, if we
                want weighting to gradually decrease to zero over a long period of time, then we may set <em>wmin
                    :=0</em> and <em>decline</em> to be large.</p>
            <p>The weighting function and its parameters may sound complicated in text, but it is best understood
                visually:</p>
            <p class="text-center italic">Insert figure 3</p>
            <p>Some examples of the weighting function using various parameters are given below:</p>
            <p class="text-center italic">Insert figure 4</p>

            <h3>Normalizing Prevalence Scores</h3>
            <p>Since only a few techniques make up a large majority of all sightings, we need to be careful about
                accounting for these outliers when we put the prevalence scores on a zero-to-one scale.</p>
            <p class="text-center italic">Insert figure 5</p>
            <p>This is a histogram of the distribution of prevalence scores across all techniques for which we have
                attack times. Note that there are a few techniques that have a prevalence score that is FAR greater than
                the scores for every other technique. If we normalize the scores using the min-max normalization
                described above, those few techniques would get a score somewhere around 0.8-1.0, while the vast
                majority of techniques would get a score close to zero.</p>
            <p>For now, we can take care of this by scaling according to a specified “percentile cutoff.” For example,
                if we set the cutoff equal to 0.9, then techniques that have a score in the 90th percentile and above
                (i.e. in the top 10% of techniques) will receive a score equal to 1, while techniques that are below the
                90th percentile will be scaled using the score of the 90th percentile as the “max.“</p>
            <h3>Limitations</h3>
            <p>There are several important considerations when reading the Sightings results. First and foremost, there
                was a limited number of contributors. This means our data does not provide a comprehensive view of the
                threat landscape. There are techniques not present in our dataset which may be relevant to organizations
                depending on their environment and relative risk.</p>
            <p>The data received was limited to the visibility of the companies who graciously contributed their data to
                the Sightings Ecosystem. Each contributor has different visibility because of demographics of their
                customer base, the location of their sensor technology (e.g., external to the network or on an email
                server), and their relative ability to detect specific activity. We hoped to overcome these limitations
                by recruiting a large number of contributors, but our limited number means there remains a visibility
                bias in our results.</p>
            <p>Our results are further limited by how our contributors map techniques to ATT&CK. Depending on when
                techniques are mapped in an incident investigation and how formalized the mapping process is, it is not
                unrealistic to think that several Sightings may have been mis-mapped.</p>
            <p>Aggregating data from multiple contributors also impacted our results. When we aggregated the data, we
                lost context on the adversaries and detections. We did not have deep insight into how the techniques are
                detected, which meant that we struggled to determine whether an increase in activity was caused by
                increased adversary activity or by improved detections.</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        methodologyList: Array,
        activeItemId: 0,
    },
    data() {
        return {

        };
    },
});
</script>

<style scoped>
.container-body {
    @apply py-4 px-6
}

.container-body h3 {
    @apply uppercase font-bold text-lg mt-3 mb-0
}

.container-body h4 {
    @apply uppercase font-bold
}

ul {
    @apply list-disc ml-6
}

ul p {
    @apply pl-4
}

.mitigations h4, .mitigations h5 {
    @apply uppercase font-bold
}

a {
    @apply text-ctid-blue hover:underline
}

p {
    @apply mb-2
}
</style>