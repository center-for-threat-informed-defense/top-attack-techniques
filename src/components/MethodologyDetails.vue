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
            <div class="my-4">
                <img src="../assets/methodology/figure1.png" class="md:w-1/2 mx-auto"
                    alt="Scatterplot mapping number of detections on the x axis and number of mitigations on the y axis. Each point represents a single technique. The majority of techniques are below 20 detections and under 30 mitigations, but there are about 20 outliers. " />
            </div>
            <p>You can see there are quite a few outliers, especially for detections. Keep in mind that there are known
                to be duplicates, so there is likely some double counting.</p>

            <h3>Framing the Analysis</h3>
            <p>This approach is based on techniques for "Multiple-criteria decision-making."</p>
            <h4>Attribute Utilities</h4>
            <p>Each technique has two attributes for determining actionability: the number of available detections, and
                the number of available mitigations. In order to combine them into a single score, we'll need to
                normalize using a "utility" function $u$ for each of these attributes. This will map the value of an
                attribute to a number between 0 and 1 which indicates how much that value contributes to actionability.
            </p>
            <p>For simplicity and interpretability, we recommend using a piecewise linear utility function, like this:
            </p>
            <div>$$ {{ formula1 }} $$</div>

            <p>Here, $ x $ is the value of some attribute (ex: # mitigations), $ upper $ and $ lower $
                are the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have zero
                utility,
                values above the upper cutoff have maximum utility.</p>

            <p>For example, if 130 detection methods are not much more "valuable" than 100, then we may consider
                specifying an upper cutoff of 100 for detections. Conversely, if 10 detection methods aren't much
                more
                valuable than 0 methods then we might set the lower cutoff to be 10. Moreover, using cutoffs like
                this
                will prevent cases where a technique has a very large number of detections but absolutely no
                mitigations
                might still get a high actionability score.
            </p>
            <p>[notes: upper cutoff should be no larger than the largest value for its attribute, and lower cutoff
                should
                be no lower than the smallest value for its attribute]</p>
            <p>Bottom line: For each attribute (# detections and # mitigations), set the lower cutoff to the
                smallest
                value that "usefully" contributes to actionability (default to the lowest value), and set the upper
                cutoff to the largest value that "usefully" contributes to actionability (default to something close
                to
                the largest value).</p>
            <p> These cutoffs need to be specified for multiple reasons:</p>
            <ul>
                <li>In order to combine mitigations and detections into a single function, they must both be on the
                    same
                    scale. If we were to scale them according to the smallest and largest values for each, then the
                    scaling would be determined by the (likely double-counted) outliers</li>
                <li>Prevent a technique with no mitigations but many detections from receiving an inflated
                    actionability
                    score</li>
                <li>Prevent the weighting from changing when new data (potentially a very large outlier) gets added
                </li>
            </ul>
            <p>For example scores, the cutoffs are 0 and 100 for detections, and 0 and 55 for mitigations.</p>
            <p>Examples of potential utility functions are illustrated below:</p>
            <div class="my-4">
                <img src="../assets/methodology/utility_examples.png" class="md:w-1/2 mx-auto"
                    alt="line graph that visualizes different examples of the recommended piecewise utility function with lower and upper cutoffs used to normalize a technique's mitigation and detection score into a single number " />
            </div>
            <h4>Defining Attribute Weighting</h4>
            <p>We then define weights for each of the attributes to rank their importance. Once we have the weights
                defined, the Actionability score is computed as:</p>
            <div>$$ {{ actionabilityScore }} $$</div>

            <p> so in our case with number of detections and number of mitigations as our attributes, it will be:
            </p>
            <div>$$ {{ actionabilityFormula }} $$</div>
            <p>Where $x_{d}$ and $ x_{m}$ are the raw counts of detections and mitigations, $ w_{d} $ and $ w_{m} $ are
                their weights, and $u_{d} $ and $ u_{m} $ are their utility functions.
            </p>
            <p>Since we are using utility functions, we need to be careful with how we define the weights.</p>
            <p>Bottom line: to make sure the weights have a "physical" meaning, we will define them using weighting
                ratios</p>
            <div>$${{ formula2 }}$$</div>
            <p>If we want 1 mitigation to be worth 2 detections, then we'd set ${{ formula2 }}=2$. This method can
                be extended to problems with more than two attributes.
            </p>
            <h4>How to Get Weights from Weighting Ratios</h4>
            <p>The actionability formula is: ${{ actionabilityFormula }}$. If ${{ formula3 }}$ and ${{ formula4 }}$
                (i.e. they are both in the main "linear domain") then we can write this as:
            </p>
            <div>$$ {{ formula5 }} $$</div>
            <p>If we want each mitigation to be worth two detections, then we should set the $ wm $ and $ wd $
                so that the following relation is satisfied (if the ratio is changed, then you would change the 2
                here to whatever the new ratio is): ${{ formula6 }}$. The derivatives of A
                are: </p>
            <p class="text-center">${{ formula7 }}$ and ${{ formula8 }}$ </p>

            <p> When we plug these into the above relation, we see that the relation to be satisfied becomes
                ${{ formula9 }}$. So we can set ${{ formula10 }}$ and use the above relations to find a value for $
                w_{d}
                $.
            </p>
            <p class="text-center">${{ formula10 }}$ and ${{ formula11 }}$</p>
            <p>Then, to ensure actionability ranges from zero to one, we just need to normalize the weights so that they
                add up to one (i.e. we want $ w'_{d} + w'_{m} = 1 $.) We can do this by dividing each un-normalized
                weight by the sum of all weights: ${{ formula12 }}$ and ${{ formula13 }}$ where $w'_{m}$ and $w'_{d}$
                are
                the values of $w_{m}$ and $w_{d}$ before normalizing.
            </p>

            <h4>What if we have more than two attributes?</h4>
            <p>For actionability we may want to incorporate some weighting for the number of ATT&CK datasources each
                technique has. Furthermore, this method might be used for one of the other scores, which may have
                more
                than two attributes. It is not too difficult to generalize this to work with three or more
                attributes.
            </p>
            <p>Suppose we have 5 attributes, named a, b, c, d, and e, and each attribute has an upper and lower
                cutoff. The steps to defining their weights are:</p>
            <ol class="list-decimal pl-6">
                <li>Make a "hierarchy" of attributes by importance</li>
                <ul>
                    <li>Example: $e > [a,b] > d > c$</li>
                </ul>
                <li>For each "level", define the weighting ratios</li>
                <ul>
                    <li>Example: ${{ formula14 }}$</li>
                </ul>
                <li>Set highest level's weights to 1 and use ratios to set the weights for the lower levels
                    according to ${{ formula15 }}$
                </li>
                <ul>
                    <li>Example: $w_{e} := 1$, then ${{ formula16 }}$ and ${{ formula17 }}$, etc.</li>
                </ul>
                <li>Adjust the weights with each attribute's cutoffs according to ${{ formula18 }}$</li>
                <li>Adjust so the weights add up to one</li>
                <ul>
                    <li>Let $S = w_{a}+...+w_{e}$. Then, set $w_{a}:=w_{a}/S$,..., $w_{e}:=w_{e}/S$</li>
                </ul>
            </ol>

            <p>This is a contour plot of actionability scores -- patches of the same color have (roughly) the same
                value
                of actionability</p>
            <ul>
                <li>Actionability ranges from zero to one. This will make things much easier when it comes time to
                    combine the scores from actionability, chokepoint and so on.</li>
                <li>You can see that the highest score that a technique with no mitigations can have is about 0.45
                </li>
            </ul>
            <div class="my-4">
                <img src="../assets/methodology/actionability_with_utility.png" class="md:w-1/2 mx-auto"
                    alt="scatterplot displaying number of detections on the x axis and number of mitigations on the y axis with actionability scores calculated from the actionability formula overlayed on top. Most techniques have an actionability score between 0 and 0.45" />
            </div>
            <p> Here's what actionability would look like if we didn't use utility functions to scale detections and
                mitigations. We can see that actionability is now unbounded, which will make things difficult to combine
                later on. Also, even if a technique has zero mitigations, it could still receive a high actionability
                score if its detections is high enough.</p>
            <div class="my-4">
                <img src="../assets/methodology/actionability_without_utility.png" class="md:w-1/2 mx-auto"
                    alt="scatterplot displaying number of detections on the x axis and number of mitigations on the y axis with actionability scores overlayed on top. Since these scores have not been scaled with the utility function, actionability is unbounded and the highest value is 350 as opposed to 0. Most techniques have a score between o and 100." />
            </div>
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
            <div class="my-4">
                <img src="../assets/methodology/choke_point_success.png" class="md:w-1/2 mx-auto"
                    alt="example of a choke point where six techniques all point to process injection as the next technique in an attack flow before moving on to another technique" />
                <p class="text-center italic mt-2">T1055: Process Injection Successful Choke Point</p>
            </div>
            <p><a href="https://attack.mitre.org/techniques/T1055/" target="_blank">T1055: Process Injection</a> is a
                great example of many techniques calling Process Injection as the next technique in succession for the
                cyber attack then proceeding to any number of other techniques afterwards.</p>
            <div class="my-4">
                <img src="../assets/methodology/choke_point_failure.png" class="md:w-1/3 mx-auto"
                    alt="example of a failed choke point where one technique leads to another technique and does not have another technique afterwards." />
                <p class="text-center italic mt-2">T1491: Defacement Non-Successful Choke Point</p>
            </div>
            <p><a href="https://attack.mitre.org/techniques/T1491/" target="_blank">T1491: Defacement</a> is a great
                example of how only one technique could funnel into another and there wouldn’t be a following technique
                after Defacement.</p>
            <p>By utilizing the same equation as Actionability, this allows us to understand and interpret the
                confidence level of choke point and to set parameters. This method is much clearer to see what the
                inputs are and how changing them will change the output. This method also does not make any assumptions
                about the structure of the connections between techniques beyond the data that was initially used.</p>
            <p>The chokepoint formula for a technique is written as ${{ chokePoint1 }}$</p>
            <p> Here $x_{b}$ and $x_{a}$ are the number of before and after techniques for the technique in question,
                while $u_{b}$ and $u_{a}$ are their "utility" functions. Finally, $w_{b}$ and $w_{a}$ are the weights
                for before and after techniques, which are define further below using relative weighting ratios.
            </p>
            <h4>Utility Functions</h4>
            <p>For each potential chokepoint, we have two attributes: the number of before techniques it has, and the
                number of after techniques it has. In order to combine them, we define "utility" functions $u_{b}$ and
                $u_{a}$ for # before and # after, respectively. These functions define the "value" as:</p>
            <div>$${{ formula1 }}$$</div>
            <p>Where $ x $ is the value of some attribute (ex: # of before techniques), and $ upper $ and
                $ lower $ are the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have
                zero utility, values above the upper cutoff have maximum utility. We set these to the smallest "useful"
                number of before or after techniques.
            </p>
            <p>[note: the upper cutoff should be no larger than the largest value for its attribute, and the lower
                cutoff should be no lower than the smallest value for its attribute.]</p>
            <p>Examples of potential utility functions are illustrated below:</p>
            <div class="my-4">
                <img src="../assets/methodology/utility_examples.png" class="md:w-1/2 mx-auto"
                    alt="line graph that visualizes different examples of the recommended piecewise utility function with lower and upper cutoffs used to normalize a technique's mitigation and detection score into a single number " />
            </div>
            <h4>Attribute Weighting</h4>
            <p>We define the weights $w_{b}$ and $w_{a}$ by a "weighting ratio" which is set by asking how many after
                techniques is "worth" one before technique: ${{ chokePoint2 }}$ the number of after techniques worth one
                before technique.
            </p>
            <p>If you want them to be weighted equally, set this equal to 1. If you want before techniques to be worth
                1.2 after techniques, set this equal to 1.2. Below is how to go from this ratio to the actual weights
                $w_{b}$ and $w_{a}$.
            </p>
            <p>First, we find the un-normalized weights $w'_{b}$ and $w'_{a}$. Set</p>
            <div>$${{ chokePoint3 }}$$</div>

            <p>Then normalize so that they add up to 1 to get the actual weights: ${{ chokePoint4 }}$ </p>
            <p> Here is how the expression for $w'_{b}$ and $w'_{a}$ was derived:</p>
            <p>The chokepoint formula is ${{ chokePoint1 }}$. If ${{ chokePoint5 }}$ (i.e. they are both in the
                main "linear domain") then we can write this as:</p>
            <div>$${{ chokePoint6 }}$$</div>
            <p>In order to be weighted according to the ratio we specified, the weights $w_{b}$ and $w_{a}$ should be
                set so that the following relation is satisfied: ${{ chokePoint7 }}$</p>
            <p>The derivatives of $ C $ are: ${{ chokePoint8 }}$</p>
            <p>When we plug these into the above relation, we see that the relation to be satisfied becomes:</p>
            <div>$${{ chokePoint9 }}$$</div>
            <p> So we can set $w_{b} :=1$ and use the above relations to find a value for $w_{a}$.</p>
            <h3>Plotting Chokepoint</h3>
            <p>We can make a scatter plot of the number of before and after techniques among the potential chokepoints:
            </p>
            <div class="my-4">
                <img src="../assets/methodology/before_after_techniques.png" class="md:w-1/2 mx-auto"
                    alt="Scatterplot mapping the number of techniques before on the x axis and the number of techniques after on the y axis. Most techniques that are possible chokepoints have more techniques before them than after" />
            </div>
            <p>And we can overlay this with a contour plot of the actual chokepoint function (patches of the same color
                have roughly the same chokepoint score)</p>
            <div class="my-4">
                <img src="../assets/methodology/chokepoint_with_utility.png" class="md:w-1/2 mx-auto"
                    alt="Scatterplot mapping the number of techniques before on the x axis and the number of techniques after on the y axis with chokepoint scores overlayed on top. Most techniques have a chokepoint score below 0.45" />
            </div>
            <p>And we can compare this with a plot of what the chokepoint function would look like had we not used
                utility functions to scale the number of before and after techniques:</p>
            <div class="my-4">
                <img src="../assets/methodology/chokepoint_without_utility.png" class="md:w-1/2 mx-auto"
                    alt="Scatterplot mapping the number of techniques before on the x axis and the number of techniques after on the y axis with chokepoint scores overlayed on top. Because it is not normalized by the utility function, chokepoint scores can range up to 30." />
            </div>
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
            <p>For a technique that has attack times {$t_{0}, t_{1}, ... , t_{n} $}, we calculate the technique's
                un-normalized prevalence score as: ${{ prevalence1 }}$ where $ w $ is the time weighting function which
                assigns a weight (between zero and one) to an attack based on its proximity to the present time
                ($t_{now}$). It is defined by:</p>
            <div>$${{ prevalence2 }}$$</div>
            <p>Here, Δ𝑡 is the time between the attack and the present time. We have three parameters in the weighting
                function that can be adjusted:</p>
            <ul>
                <li>$ full $ is the number of days into the past (relative to the present) for which we want
                    attacks to be given full weighting. The weighting of attacks will start to decline if they occur
                    more than $ full $ days into the past.
                </li>
                <li>$ decline $ is the number of days after $ full $ has been reached over which the weighting
                    decreases to its minimum value. This controls the "steepness" of the falloff.
                </li>
                <li>$w_{min} := 0$ is the minimum weight an attack can have. Attacks
                    that occurred more than $ full $ + $ decline $ days into the past will have a weighting of
                    $w_{min} := 0$. This controls the "strength" of the weighting.
                </li>
            </ul>
            <p>The combination of these three parameters controls the strength and rate of weighting. For example, if we
                want weighting to gradually decrease to zero over a long period of time, then we may set $w_{min} := 0$
                and $ decline $ to be large.</p>
            <p>The weighting function and its parameters may sound complicated in text, but it is best understood
                visually:</p>
            <div class="my-4">
                <img src="../assets/methodology/weighting_function.png" class="md:w-1/2 mx-auto"
                    alt="Line graph that visualizes the weight of a technique on the y axis over time on the x axis. Techniques have a weight of wmin until decline is reached, at which point the weight increases in a straight line until full is reached. For the full time period, the weight is 1. " />
            </div>
            <p>Some examples of the weighting function using various parameters are given below:</p>
            <div class="my-4">
                <img src="../assets/methodology/weighting-examples.png" class="md:w-2/3 mx-auto"
                    alt="Examples of three weighting functions, demonstrating how changing the values for full, decline, and wmin can alter the weighting function. The smaller the distance between full and decline and the larger the distance between wwmin and 1, the steeper the slope of the weighting function becomes." />
            </div>
            <h3>Normalizing Prevalence Scores</h3>
            <p>Since only a few techniques make up a large majority of all sightings, we need to be careful about
                accounting for these outliers when we put the prevalence scores on a zero-to-one scale.</p>
            <div class="my-4">
                <img src="../assets/methodology/distribution.png" class="md:w-2/3 mx-auto"
                    alt="bar chart showing unnormalized prevalence on the x axis and weight on the y axis. The scale is so varied that most weights are hardly visible, demonstrating the need for normalization." />
            </div>
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
        activeItemId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            formula1: '\\begin{equation*}\\mathrm{u(x)}=\\begin{cases}\\mathrm{0} & \\mathrm{x< lower}\\\\ \\mathrm{\\frac{x-lower}{upper-lower}} & \\mathrm{lower \\leq x \\leq upper}\\\\ \\mathrm{1} & \\mathrm{x >upper}\\end{cases}\\end{equation*}',
            actionabilityScore: '\\mathrm{A(x)=\\sum\\limits _{i} w_{i} \\cdot u_{i}( x_{i})}',
            actionabilityFormula: `\\begin{equation}
            \\mathrm{A( x_{d} ,x_{m}) \\ =\\ w_{d} \\cdot \\ u_{d}( \\ x_{d}) +w_{m} \\cdot \\ u_{m}( x_{m})}
            \\end{equation}`,
            formula2: `\\mathrm{ratio\\left(\\frac{mitigations}{detections}\\right)}`,
            formula3: '\\mathrm{lower_{d}  \\leq x_{d}  \\leq upper_{d}}',
            formula4: '\\mathrm{lower_{m}  \\leq x_{m}  \\leq upper_{m}}',
            formula5: '\\begin{equation*}\\mathrm{A( x_{d} ,x_{m}) \\ =w_{d} \\cdot \\frac{x\\mathrm{_{d}} -lower\\mathrm{_{d}}}{upper\\mathrm{_{d}} -lower\\mathrm{_{d}}} +\\ w_{m} \\cdot \\frac{x\\mathrm{_{m}} -lower\\mathrm{_{m}}}{upper\\mathrm{_{m}} -lower\\mathrm{_{m}}}}\\end{equation*}',
            formula6: '\\mathrm{\\frac{\\partial A}{\\partial x\\mathrm{_{m}}} \\ =\\ 2\\ \\cdot \\frac{\\partial A}{\\partial x\\mathrm{_{d}}}}',
            formula7: '\\mathrm{\\frac{\\partial A}{\\partial x\\mathrm{_{m}}}  = \\frac{w\\mathrm{_{m}}}{upper\\mathrm{_{m}} -lower\\mathrm{_{m}}}}',
            formula8: '\\mathrm{\\frac{\\partial A}{\\partial x\\mathrm{_{d}}}  = \\frac{w\\mathrm{_{d}}}{upper\\mathrm{_{d}} -lower\\mathrm{_{d}}}}',
            formula9: '\\mathrm{\\frac{w\\mathrm{_{m}}}{upper\\mathrm{_{m}} -lower\\mathrm{_{m}}}} =2\\mathrm{\\cdot \\frac{w\\mathrm{_{d}}}{upper\\mathrm{_{d}} -lower\\mathrm{_{d}}}}',
            formula10: '\\begin{equation*}\\mathrm{w_{m} := \\ 1}\\end{equation*}',
            formula11: '\\mathrm{w_{d} \\:=  \\frac{w\\mathrm{_{m}}}{2} \\cdot \\frac{upper\\mathrm{_{d}} -lower\\mathrm{_{d}}}{upper\\mathrm{_{m}} -lower\\mathrm{_{m}}}}',
            formula12: `\\begin{equation*}\\mathrm{w_{m} \\:= \\ \\frac{w'\\mathrm{_{m}}}{w'\\mathrm{_{m}} -w'\\mathrm{_{d}}}}\\end{equation*}`,
            formula13: `\\mathrm{\\ w_{d} \\:= \\ \\frac{w'\\mathrm{_{d}}}{w'\\mathrm{_{m}} -w'\\mathrm{_{d}}}}`,
            formula14: '\\begin{equation*}\\mathrm{ratio\\left(\\frac{e}{a}\\right) =ratio\\left(\\frac{e}{b}\\right) =2\\ ,\\ ratio\\left(\\frac{a}{d}\\right) =ratio\\left(\\frac{b}{d}\\right) =3\\ ,\\ \\text{and}\\ ratio\\left(\\frac{d}{c}\\right) =\\frac{3}{2}}\\end{equation*}',
            formula15: '\\begin{equation*}\\mathrm{w_{y} \\cdot ratio\\left(\\frac{x}{y}\\right)} =\\mathrm{w_{x}}\\end{equation*}',
            formula16: '\\mathrm{w_{a} \\cdot ratio\\left(\\frac{e}{a}\\right) =w_{e} \\Rightarrow \\ w_{a} := \\ \\frac{1}{2}}',
            formula17: '\\mathrm{\\ w_{b} := \\frac{1}{2}}',
            formula18: '\\begin{equation*}\\mathrm{w_{x} := \\frac{w\\mathrm{_{x}}}{upper\\mathrm{_{x}} -lower\\mathrm{_{x}}}}\\end{equation*}',
            chokePoint1: '\\begin{equation}\\mathrm{C( x_{b} ,x_{a})=\\ w_{b} \\cdot \\ u_{d}( \\ x_{b}) +w_{a} \\cdot \\ u_{a}( x_{a})}\\end{equation}',
            chokePoint2: '\\begin{equation*}\\mathrm{ratio\\left(\\frac{before}{after}\\right) := }\\end{equation*}',
            chokePoint3: "\\mathrm{w'_{b} := 1 \\text{ and }\\ w'_{a} := \\frac{w'\\mathrm{_{b}}}{\\mathrm{ratio\\left(\\frac{before}{after}\\right)}} \\cdot \\frac{upper\\mathrm{_{after}} -lower\\mathrm{_{after}}}{upper\\mathrm{_{before}} -lower\\mathrm{_{before}}}}",
            chokePoint4: "\\mathrm{ w_{b} :=  \\frac{w'\\mathrm{_{b}}}{w'\\mathrm{_{b}} -w'\\mathrm{_{a}}} \\text{ and } w_{a} :=  \\frac{w'\\mathrm{_{a}}}{w'\\mathrm{_{a}} -w'\\mathrm{_{b}}}}",
            chokePoint5: "\\mathrm{ lower_{b} \\leq x_{b} \\leq upper_{b} \\text{ and } lower_{a} \\leq x_{a} \\leq upper_{a}}",
            chokePoint6: '\\mathrm{C( x_{b} ,x_{a})  = w_{b} \\cdot \\frac{x\\mathrm{_{b}} -lower\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}}} +\\mathrm{ w_{a} \\cdot \\frac{x\\mathrm{_{a}} -lower\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}}}',
            chokePoint7: '\\mathrm{\\frac{\\partial C}{\\partial x\\mathrm{_{b}}}  =ratio\\left(  \\frac{before}{after}\\right) \\cdot \\frac{\\partial C}{\\partial x\\mathrm{_{b}}}}',
            chokePoint8: '\\mathrm{\\frac{\\partial C}{\\partial x\\mathrm{_{b}}}  = \\frac{w\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}} \\text{ and } \\frac{\\partial C}{\\partial x\\mathrm{_{a}}}  = \\frac{w\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}}}',
            chokePoint9: '\\begin{equation*}\\mathrm{ \\frac{w\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}} =ratio\\left(  \\frac{before}{after}\\right)\\cdot \\frac{w\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}} }\\end{equation*}',
            prevalence1: '\\mathrm{P = \\sum\\limits _{i=1}^{n} w( t_{now} -t_{i})}',
            prevalence2: "\\begin{equation*}\\mathrm{w( t_{now} -t_{i}) =w( \\Delta t)} = \\begin{cases}\\mathrm{w_{min}} & \\mathrm{ \\Delta t > full + decline} \\\\ \\mathrm{w_{min}\\frac{\\Delta t - full}{decline}- \\frac{\\Delta t - full - decline}{decline}}& \\mathrm{ full \\leq \\Delta t \\leq full + decline} \\\\ 1 & \\mathrm{ \\Delta t < full } \\end{cases}\\end{equation*}",
        };
    },
    components: {
    }
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
    @apply list-disc ml-6 mb-4
}

ol {
    @apply mb-4
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

.MathJax_Display {
    margin-bottom: 10px !important;
}
</style>