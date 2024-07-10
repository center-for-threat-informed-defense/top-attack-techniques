<template>
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
</template>
<script lang="ts">
import { defineComponent } from "vue";
declare const MathJax: { typeset: () => void }
export default defineComponent({
    data() {
        return {
            formula1: '\\begin{equation*}\\mathrm{u(x)}=\\begin{cases}\\mathrm{0} & \\mathrm{x< lower}\\\\ \\mathrm{\\frac{x-lower}{upper-lower}} & \\mathrm{lower \\leq x \\leq upper}\\\\ \\mathrm{1} & \\mathrm{x >upper}\\end{cases}\\end{equation*}',
            chokePoint1: '\\begin{equation}\\mathrm{C( x_{b} ,x_{a})=\\ w_{b} \\cdot \\ u_{d}( \\ x_{b}) +w_{a} \\cdot \\ u_{a}( x_{a})}\\end{equation}',
            chokePoint2: '\\begin{equation*}\\mathrm{ratio\\left(\\frac{before}{after}\\right) := }\\end{equation*}',
            chokePoint3: "\\mathrm{w'_{b} := 1 \\text{ and }\\ w'_{a} := \\frac{w'\\mathrm{_{b}}}{\\mathrm{ratio\\left(\\frac{before}{after}\\right)}} \\cdot \\frac{upper\\mathrm{_{after}} -lower\\mathrm{_{after}}}{upper\\mathrm{_{before}} -lower\\mathrm{_{before}}}}",
            chokePoint4: "\\mathrm{ w_{b} :=  \\frac{w'\\mathrm{_{b}}}{w'\\mathrm{_{b}} -w'\\mathrm{_{a}}} \\text{ and } w_{a} :=  \\frac{w'\\mathrm{_{a}}}{w'\\mathrm{_{a}} -w'\\mathrm{_{b}}}}",
            chokePoint5: "\\mathrm{ lower_{b} \\leq x_{b} \\leq upper_{b} \\text{ and } lower_{a} \\leq x_{a} \\leq upper_{a}}",
            chokePoint6: '\\mathrm{C( x_{b} ,x_{a})  = w_{b} \\cdot \\frac{x\\mathrm{_{b}} -lower\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}}} +\\mathrm{ w_{a} \\cdot \\frac{x\\mathrm{_{a}} -lower\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}}}',
            chokePoint7: '\\mathrm{\\frac{\\partial C}{\\partial x\\mathrm{_{b}}}  =ratio\\left(  \\frac{before}{after}\\right) \\cdot \\frac{\\partial C}{\\partial x\\mathrm{_{b}}}}',
            chokePoint8: '\\mathrm{\\frac{\\partial C}{\\partial x\\mathrm{_{b}}}  = \\frac{w\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}} \\text{ and } \\frac{\\partial C}{\\partial x\\mathrm{_{a}}}  = \\frac{w\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}}}',
            chokePoint9: '\\begin{equation*}\\mathrm{ \\frac{w\\mathrm{_{b}}}{upper\\mathrm{_{b}} -lower\\mathrm{_{b}}} =ratio\\left(  \\frac{before}{after}\\right)\\cdot \\frac{w\\mathrm{_{a}}}{upper\\mathrm{_{a}} -lower\\mathrm{_{a}}} }\\end{equation*}',
        };
    },
    mounted() {
        MathJax.typeset()
    }
});
</script>

<style scoped>
h3 {
    @apply uppercase font-bold text-lg mt-3 mb-0
}

h4 {
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

a {
    @apply text-ctid-blue hover:underline
}

p {
    @apply mb-2
}
</style>