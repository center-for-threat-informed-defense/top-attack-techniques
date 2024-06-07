<template>

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

</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            prevalence1: '\\mathrm{P = \\sum\\limits _{i=1}^{n} w( t_{now} -t_{i})}',
            prevalence2: "\\begin{equation*}\\mathrm{w( t_{now} -t_{i}) =w( \\Delta t)} = \\begin{cases}\\mathrm{w_{min}} & \\mathrm{ \\Delta t > full + decline} \\\\ \\mathrm{w_{min}\\frac{\\Delta t - full}{decline}- \\frac{\\Delta t - full - decline}{decline}}& \\mathrm{ full \\leq \\Delta t \\leq full + decline} \\\\ 1 & \\mathrm{ \\Delta t < full } \\end{cases}\\end{equation*}",
        };
    },
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