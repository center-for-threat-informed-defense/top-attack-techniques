<template>
    <h3>Why we include actionability</h3>
    <p>It’s important to understand how a defender can take action to protect themselves against a specific
        technique. Depending on the number of publicly available detections and mitigations per technique, this
        allows the defender the ability respond to an incident faster, or to prevent the incident all together.
    </p>
    <h3>Finding Actionability</h3>
    <p>We broke down actionability into two categories: detections and mitigations. </p>
    <p>For detections, we reviewed several publicly available analytic resources and mapped each of them to
        ATT&CK. The repositories we used were <a href="https://car.mitre.org/" target="_blank">MITRE’s Cyber
            Analytic Repository</a>, <a href="https://github.com/elastic/detection-rules" target="_blank">Elastic</a>,
        <a href="https://github.com/SigmaHQ/sigma" target="_blank">Sigma HQ's
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
    <p>If we want each mitigation to be worth two detections, then we should set the $ w_{m} $ and $ w_{d} $
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
        are the values of $w_{m}$ and $w_{d}$ before normalizing.
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

</template>

<script lang="ts">
import { defineComponent } from "vue";
declare const MathJax: { typeset: () => void }
export default defineComponent({
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