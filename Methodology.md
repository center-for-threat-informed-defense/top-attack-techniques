# Top Attack Technique Methodology
<h1>Prevalence</h1>
<b>Prevalence: the frequency of which an attacker uses a specific MITRE ATT&CK technique over a period of time. </b>

<h2>Why do we want to include Prevalence</h2>
This methodology allows us to see which techniques are actually being observed during cyber intrusions. With this knowledge, defenders can tailor their detection tools to look for those techniques that have the highest frequency and are the most current.

The prevalence methodology is populated with data from the Sightings Ecosystem. Each Sighting represents one or more ATT&CK techniques used by an adversary on (or to target) victim infrastructure. For more information on Sightings, click here. 

There are a few limitations with our data that are important to understand. First, our data is limited to the data that was shared with us by our contributors. This data is not all-inclusive and is not representative of all attacks around the world. Second, our data is scoped from 1 April, 2019 to 31 July, 2021. Finally, our data is limited to how our contributors map data to ATT&CK. It is unclear if an increase in a certain technique means that it occurred more often or if it was detections simply improved.

When looking at our data, it is important to remember that defending against our most observed techniques will not protect you from all adversary activity. It will only protect you from the adversary activity most observed by Sightings contributors. Despite these barriers, the Sightings data has given great insights into techniques that are frequently used by adversaries and its inclusion in our Top ATT&CK Techniques methodologies is helps insert real-world data into our analysis.

<h2>Framing the Analysis</h2> 
<b>Proposal for the prevalence metric:</b>

For a technique that has attack times {t0, t1, … , tn}, we calculate the technique’s un-normalized prevalence score as: ![Prev1](https://user-images.githubusercontent.com/86126040/166496655-165e31c0-2831-41d1-babb-6349935a6ffb.png) Where 𝑤 is the time weighting function which assigns a weight (between zero and one) to an attack based on its proximity to the present time (𝑡𝑛𝑜𝑤). It is defined by

![Prev2](https://user-images.githubusercontent.com/86126040/166496797-6db935f9-f33a-40a2-bc14-c8606389dd56.png)
Here, Δ𝑡 is the time between the attack and the present time. We have three parameters in the weighting function that can be adjusted:

- 𝑓𝑢𝑙𝑙 is the number of days into the past (relative to the present) for which we want attacks to be given full weighting. The weighting of attacks will start to decline if they occur more than 𝑓𝑢𝑙𝑙 days into the past
- 𝑑𝑒𝑐𝑙𝑖𝑛𝑒 is the number of days after 𝑓𝑢𝑙𝑙 has been reached over which the weighting decreases to its minimum value. This controls the "steepness" of the falloff
- 𝑤𝑚𝑖𝑛 is the minimum weight an attack can have. Attacks that occurred more than 𝑓𝑢𝑙𝑙+𝑑𝑒𝑙𝑐𝑖𝑛𝑒 days into the past will have a weighting of 𝑤𝑚𝑖𝑛. This controls the "strength" of the weighting
The combination of these three parameters control the strength and rate of weighting. For example, if we want weighting to gradually decrease to zero over a long period of time, then we may set 𝑤𝑚𝑖𝑛:=0 and 𝑑𝑒𝑐𝑙𝑖𝑛𝑒 to be large.

The weighting function and its parameters may sound complicated in text, but it is best understood visually:
![Prev3](https://user-images.githubusercontent.com/86126040/166497066-3b9f2d32-5956-45fe-9a84-6fe483b53200.png)
Some examples of the weighting function using various parameters are given below:
![Prev4](https://user-images.githubusercontent.com/86126040/166497152-c40d64c0-4ec6-40d7-b261-f4ce612f7710.png)

<b>Normalizing prevalence scores</b>

Since only a few techniques make up a large majority of all sightings, we need to be careful about accounting for these outliers when we put the prevalence scores on a zero-to-one scale.

![Prev5](https://user-images.githubusercontent.com/86126040/166499610-e09418f5-6eab-48f5-9d9e-c6fbf1da1b1a.png)
This is a histogram of the distribution of prevalence scores across all techniques for which we have attack times. Note that there are a few techniques that have a prevalence score that is FAR greater than the scores for every other technique. If we normalize the scores using the min-max normalization described above, those few techniques would get a score somewhere around 0.8-1.0, while the vast majority of techniques would get a score close to zero.

For now, we can take care of this by scaling according to a specified “percentile cutoff.” For example, if we set the cutoff equal to 0.9, then techniques that have a score in the 90th percentile and above (i.e. in the top 10% of techniques) will receive a score equal to 1, while techniques that are below the 90th percentile will be scaled using the score of the 90th percentile as the “max.“

<b>Limitations</b>

There are several important considerations when reading the Sightings results. First and foremost, there was a limited number of contributors. This means our data does not provide a comprehensive view of the threat landscape. There are techniques not present in our dataset which may be relevant to organizations depending on their environment and relative risk.

The data received was limited to the visibility of the companies who graciously contributed their data to the Sightings Ecosystem. Each contributor has different visibility because of demographics of their customer base, the location of their sensor technology (e.g., external to the network or on an email server), and their relative ability to detect specific activity. We hoped to overcome these limitations by recruiting a large number of contributors, but our limited number means there remains a visibility bias in our results.

Our results are further limited by how our contributors map techniques to ATT&CK. Depending on when techniques are mapped in an incident investigation and how formalized the mapping process is, it is not unrealistic to think that several Sightings may have been mis-mapped.

Aggregating data from multiple contributors also impacted our results. When we aggregated the data, we lost context on the adversaries and detections. We did not have deep insight into how the techniques are detected, which meant that we struggled to determine whether an increase in activity was caused
by increased adversary activity or by improved detections.

<h1>Choke Point</h1>
<b>Choke Point: a specific technique where many other techniques converge or diverge, and eliminating that specific technique would cause disruption to an adversary</b>

<h2>Why do we want to include Chokepoints</h2>
Analyzing chokepoints can assist defenders to pinpoint critical techniques needed to be successful in an attack. These techniques serve as the common denominator amongst in otherwise disparate attacks. For instance, T1047 (WMI) can serve as a choke point because there are a many other techniques that can be executed after an adversary executes WMI. Defending against malicious WMI usage can limit the potential attack path that an adversary might have used.

<h2>Executive Summary</h2>
The MITRE team subjectively analyzed open-source threat reports and cyber incidents to identify techniques that had many techniques achieve multiple objectives, and common techniques that had many other techniques leading up to it and happening after it. We created one-to-many, many-to-one, and many-to-many mappings to help us find out choke points. MITRE ATT&CK Tactics were first used to narrow scope and help determine likelihood of chokepoint techniques. The team defined preceding and subsequent techniques for each chokepoint. Total count of preceding and subsequent techniques are assigned an attribute. The attribute is the confidence level, confidence level is the technique’s probability to offer more avenues for a successful attack.

<b>Future Recommendations</b>: In depth chokepoint analysis may require ML/AI components to visualize and predict all viable paths an attacker could take. An attack graph would display a representation of paths an adversary has successfully achieved a goal. At a high level, a type of representation would resemble a web where techniques branch out and co-occurrences can be identified. The attack graph can implement user’s implemented controls to better define what pathways are more likely to be explored by an attacker

<b>Limitations</b>: The method we used to find choke points is highly subjective. Our analysis was done by manually examining each technique, searching for references in CTI, and identifying before and after techniques. For some techniques,

<h2>Framing the Analysis</h2> 
To help limit the scope of techniques to review, the team first looked at MITRE ATT&CK Tactics that could potentially produce low Choke Point confidence levels. Tactics at the beginning and end of a cyber kill chain would not have many before and after techniques to produce high probability of an effective attack flow. Techniques under the Reconnaissance and Resource Development Tactics received a baseline of 0:1 to indicate at least one technique would take place after them. Techniques under the Impact Tactic received a baseline of 1:0 indicating at least one technique had taken place prior to them. Impact techniques are scoped as the adversaries cumulative objective so follow-on techniques were not considered. All other Tactics received a 1:1 baseline as at least one technique would occur before and after their facilitation.

The MITRE team considered choke point to be the middle technique where many other techniques could go into and come out of in an attack flow proceeding. 
![CP1](https://user-images.githubusercontent.com/86126040/166457990-f0629a02-0929-4872-acd4-bfe0a8ce84b6.png)
MITRE Technique T1055: Process Injection is a great example of many techniques calling Process Injection as the next technique in succession for the cyber attack then proceeding to any number of other techniques afterwards.
![CP2](https://user-images.githubusercontent.com/86126040/166458032-4f0ffff5-1ca1-4d26-b36a-e3cc54855942.png)
MITRE Technique T1491: Defacement is a great example of how only one technique could funnel into another and there wouldn’t be a following technique after Defacement.

By utilizing the same equation as Actionability, this allows us to understand and interpret the confidence level of choke point and to set parameters. This method is much clearer to see what the inputs are and how changing them will change the output. This method also does not make any assumptions about the structure of the connections between techniques beyond the data that was initially used.

<h3>Proposal for the choke point metric:</h3>
The chokepoint formula for a technique is written as ![CP3](https://user-images.githubusercontent.com/86126040/166458124-ecd002b2-4904-4d97-8fc6-8b304b7d9b31.png)
Here 𝑥𝑏 and 𝑥𝑎 are the number of before and after techniques for the technique in question, while 𝑢𝑏 and 𝑢𝑎 are their “utility“ functions. Finally, 𝑤𝑏 and 𝑤𝑎 are the weights for before and after techniques, which are define further below using relative weighting ratios.

<h3>Utility functions</h3>

For each potential chokepoint, we have two attributes: the number of before techniques it has, and the number of after techniques it has. In order to combine them, we define “utility“ functions 𝑢𝑏 and 𝑢𝑎 for # before and # after, respectively. These functions define the "value" of different values have the form
![CP4](https://user-images.githubusercontent.com/86126040/166491936-8c850ff3-cf42-4f5c-bbfa-80d7f6394089.png)
Where 𝑥 is the value of some attribute (ex: # of before techniques), and 𝑢𝑝𝑝𝑒𝑟 and 𝑙𝑜𝑤𝑒𝑟 are the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have zero utility, values above the upper cutoff have maximum utility. We set these to the smallest "useful" number of before or after techniques

[note: the upper cutoff should be no larger than the largest value for its attribute, and the lower cutoff should be no lower than the smallest value for its attribute.]

Examples of potential utility functions are illustrated below:
![CP5](https://user-images.githubusercontent.com/86126040/166492115-9ce7da0c-5da2-4515-bfe7-f6f42e8034d2.png)

<h3>Attribute weighting</h3>

We define the weights 𝑤𝑏 and 𝑤𝑎 by a "weighting ratio" which is set by asking how many after techniques is "worth" one before technique:
![CP6](https://user-images.githubusercontent.com/86126040/166492276-6c988b84-2942-4df4-83f7-b741dfbaab31.png)
If you want them to be weighted equally, set this equal to 1. If you want before techniques to be worth 1.2 after techniques, set this equal to 1.2. Below is how to go from this ratio to the actual weights 𝑤𝑏 and 𝑤𝑎.

First, we find the un-normalized weights 𝑤′𝑏 and 𝑤′𝑎. Set
![CP7](https://user-images.githubusercontent.com/86126040/166492781-160192ce-7581-4954-9e65-7f30cf610e0b.png)
Then normalize so that they add up to 1 to get the actual weights: 
![CP8](https://user-images.githubusercontent.com/86126040/166492859-552330fc-b246-42b5-9094-aee64c3d81d2.png)
 Here is how the expression for 𝑤′𝑏 and 𝑤′𝑎 was derived:
 The chokepoint formula is ![CP9](https://user-images.githubusercontent.com/86126040/166492908-f2c7f3f3-b882-4e41-9ddf-18b2ff49bbd4.png)
if 𝑙𝑜𝑤𝑒𝑟𝑏 ≤ 𝑥𝑏 ≤ 𝑢𝑝𝑝𝑒𝑟𝑏 and 𝑙𝑜𝑤𝑒𝑟𝑎 ≤ 𝑥𝑎 ≤ 𝑢𝑝𝑝𝑒𝑟𝑎 (i.e. they are both in the main "linear domain") then we can write this as ![CP10](https://user-images.githubusercontent.com/86126040/166492963-222ef713-8e1f-41a4-b650-eb381f7f1567.png)
In order to be weighted according to the ratio we specified, the weights 𝑤𝑏 and 𝑤𝑎 should be set so that the following relation is satisfied: 
![CP11](https://user-images.githubusercontent.com/86126040/166493013-73844486-792b-4f39-bc0a-13d0967ee377.png)
the derivatives of 𝐶 are:
![CP12](https://user-images.githubusercontent.com/86126040/166493050-e72c298e-4273-4ac7-8540-340f9e779c89.png)
When we plug these into the above relation, we see that the relation to be satisfied becomes
![CP13](https://user-images.githubusercontent.com/86126040/166493079-33fb8d79-5d5a-42b7-a927-464b837b0b32.png)
 So we can set 𝑤𝑏:=1 and use the above relations to find a value for 𝑤𝑎.

<h3>Plotting Chokepoint</h3>

We can make a scatter plot of the number of before and after techniques among the potential chokepoints:
![CP14](https://user-images.githubusercontent.com/86126040/166493139-d278b9b7-f4d3-4386-91a6-43e7aab8681f.png)
And we can overlay this with a contour plot of the actual chokepoint function (patches of the same color have roughly the same chokepoint score)
![CP15](https://user-images.githubusercontent.com/86126040/166493191-62203dce-faab-4fef-bc07-cd006be6f77c.png)
 and we can compare this with a plot of what the chokepoint function would look like had we not used utility functions to scale the number of before and after techniques
 ![CP16](https://user-images.githubusercontent.com/86126040/166493218-213ab408-c63e-457f-aa95-5026dec08bd3.png)

<h1> Actionability </h1>
<b>Actionability: The opportunity for a defender to detect or mitigate against each ATT&CK technique based on publicly available analytics and security controls.</b>

<h2>Why do we want to include Actionability</h2>
It’s important to understand how a defender can take action to protect themselves against a specific technique. Depending on the amount of publicly available detections and mitigations per technique, this allows the defender the ability respond to an incident faster, or to prevent the incident all together.

<h3>Finding Actionability:</h3>

We broke down actionability into two categories: detections and mitigations.

For detections, we reviewed several publicly available analytic resources and mapped each of them to ATT&CK. The repositories we used were MITRE’s Cyber Analytic Repository, Elastic, Sigma HQ's rules , and Splunk Detections.

For mitigations, we reviewed security controls from two publicly available repositories and mapped each of them to ATT&CK. The repositories we used were CIS Critical Security Controls and NIST 800-53 Security Controls.

We then made a total count of all detections and mitigations available for each ATT&CK technique. Techniques that have a greater amount of detections and mitigations are weighted more heavily than those with a lower amount. If a technique has a limited number of ways to detect or protect against it, we believe defending against those techniques will provide diminishing returns and more attention should be placed elsewhere.

For instance, T1014 (rootkit) has zero detections or mitigations in the repositories that we referenced. Since rootkits are better identified by heuristics and forensics than analytics and security controls, a disproportionate amount of resources would need to be used to detect or prevent against them. Those resources could be better allocated defending against techniques that are more easily detected, but just as dangerous.

There are a few limitations to this methodology. First, we did not search each repository to see if each analytic or control was still valid or if there were duplicates. Second, we did not differentiate for analytics that are similarly related. For instance, an analytic looking for Powershell executing an encoded command and one for Powershell executing Mimikatz would both count for T1053 (command and scripting interpreter). We tried to account for these limitations by setting upper bounds. After a certain point, the value of each additional analytic and control does not provide the same value to the defender. Because of this, any detections and controls over 100 and 55, respectively, do not change the weighted list.

Finally, we recognize that for some, defending against rootkits, or other similarly stealthy techniques, is just as, if not more, important than other techniques. We tried to account for this by allowing users to choose which analytics and controls should be included in the weighted list.

We then made a total count of all detections and mitigations available for each ATT&CK technique. Techniques that have a greater amount of detections and mitigations are weighted more heavily than those with a lower amount. If a technique has a limited number of ways to detect or protect against it, we believe defending against those techniques will provide diminishing returns and more attention should be placed elsewhere.

![Acionability1](https://user-images.githubusercontent.com/86126040/166447108-ba373eb2-9ce9-4f27-b167-59888aee6514.png)
You can see there are quite a few outliers, especially for detections. Keep in mind that there are known to be duplicates, so there is likely some double counting.

<h2>Framing the Analysis</h2>
This approach is based on techniques for "Multiple-criteria decision-making."

</h3>Attribute Utilities</h3>

Each technique has two attributes for determining actionability: the number of available detections, and the number of available mitigations. In order to combine them into a single score, we'll need to normalize using a "utility" function 𝑢 for each of these attributes. This will map the value of an attribute to a number between 0 and 1 which indicates how much that value contributes to actionability.

For simplicity and interpretability, We would recommend using a piecewise linear utility function, like this: ![Actionability2](https://user-images.githubusercontent.com/86126040/166447290-ff0c2a48-f1b5-4a5e-8248-b329a49b99bb.png)
Here, 𝑥 is the value of some attribute (ex: # mitigations), 𝑢𝑝𝑝𝑒𝑟 and 𝑙𝑜𝑤𝑒𝑟 are the upper and lower "cutoffs" for that attribute. Values below the lower cutoff have zero utility, values above the upper cutoff have maximum utility.

For example, if 130 detection methods are not much more "valuable" than 100, then we may consider specifying an upper cutoff of 100 for detections. Conversely, if 10 detection methods isn't much more valuable than 0 methods then we might set the lower cutoff to be 10. Moreover, using cutoffs like this will prevent cases where a technique has a very large number of detections but absolutely no mitigations might still get a high actionability score.

[notes: upper cutoff should be no larger than the largest value for its attribute, and lower cutoff should be no lower than the smallest value for its attribute]

<b>Bottom line: For each attribute (# detections and # mitigations), set the lower cutoff to the smallest value that "usefully" contributes to actionability (default to the lowest value), and set the upper cutoff to the largest value that "usefully" contributes to actionability (default to something close to the largest value).

These cutoffs need to be specified for multiple reasons:

- In order to combine mitigations and detections into a single function, they must both be on the same scale. If we were to scale them according to the smallest and largest values for each, then the scaling would be determined by the (likely double-counted) outliers
- Prevent a technique with no mitigations but many detections from receiving an inflated actionability score
- Prevent the weighting from changing when new data (potentially a very large outlier) gets added
For my example scores I'm using cutoffs of 0 and 100 for detections, and 0 and 55 for mitigations.</b>

Examples of potential utility functions are illustrated below:
![Actionability3](https://user-images.githubusercontent.com/86126040/166447376-a9beb8af-fba8-480e-82f5-f643bd27ba78.png)

<h3>Defining Attribute Weighting</h3>

We then define weights for each of the attributes to rank their importance. Once we have the weights defined, the Actionability score is computed as:
![Actionability4](https://user-images.githubusercontent.com/86126040/166447417-33624986-5fc8-47a6-a45b-f80708ca1aaf.png)
 so in our case with number of detections and number of mitigations as our attributes, it will be:
 ![Actionability5](https://user-images.githubusercontent.com/86126040/166447456-5e00dbe3-4959-4aa5-a2b0-07348f564343.png)
Where 𝑥𝑑 and 𝑥𝑚 are the raw counts of detections and mitigations, 𝑤𝑑 and 𝑤𝑚 are their weights, and 𝑢𝑑 and 𝑢𝑚 are their utility functions.

Since we are using utility functions, we need to be careful with how we define the weights.

Bottom line: to make sure the weights have a "physical" meaning, we will define them using weighting ratios
![Actionability6](https://user-images.githubusercontent.com/86126040/166447498-3a6b7ea6-cf65-45b8-9be1-4ceba3f7b971.png)
If we want 1 mitigation to be worth 2 detections, then we'd set  ![Actionability7](https://user-images.githubusercontent.com/86126040/166447525-6ca66218-df6a-446e-bcf6-143ccfa2ccf1.png) =2. This method can be extended to problems with more than two attributes.

<h3>How to Get Weights from Weighting Ratios (Optional Reading)</h3>
The actionability formula is: 
![Actionability8](https://user-images.githubusercontent.com/86126040/166456729-94cc416b-1982-4d8d-befd-684aff2cebc1.png) 
(i.e. they are both in the main "linear domain") then we can write this as 
![Actionability10](https://user-images.githubusercontent.com/86126040/166456940-a17e7965-e676-40ce-a981-953acc038bca.png) 
If we want each mitigation to be worth two detections, then we should set the 𝑤𝑚 and 𝑤𝑑 so that the following relation is satisfied (if the ratio is changed, then you would change the 2 here to whatever the new ratio is): 
![Actionability11](https://user-images.githubusercontent.com/86126040/166457059-bee04736-206b-4d7d-91fc-8c5758df7d14.png) 
the derivatives of A are: 
![Actionability12](https://user-images.githubusercontent.com/86126040/166457130-940ffd8d-480c-4a28-b59b-5ebf6faffbce.png)  
When we plug these into the above relation, we see that the relation to be satisfied becomes  
![Actionability13](https://user-images.githubusercontent.com/86126040/166457195-2d0b22fb-f2bc-4abb-be25-2a3fb8e42d0c.png) 
So we can set 𝑤𝑚:=1 and use the above relations to find a value for 𝑤𝑑. 
![Actionability14](https://user-images.githubusercontent.com/86126040/166457258-7cb9e50e-bf1e-4ffd-a5d5-7d1af2bba3f0.png) 
Then, to ensure actionability ranges from zero to one, we just need to normalize the weights so that they add up to one (i.e. we want 𝑤𝑑 + 𝑤𝑚 = 1.) We can do this by dividing each un-normalized weight by the sum of all weights: 
![Actionability15](https://user-images.githubusercontent.com/86126040/166457353-9cc9459b-d28d-403d-92fe-1b79ce2f61ec.png) 
where 𝑤′𝑚 and 𝑤′𝑑 are the values of 𝑤𝑚 and 𝑤𝑑 before normalizing.

<h3>What if we have more than two attributes? (Optional Reading)</h3>

For actionability we may want to incorporate some weighting for the number of ATT&CK datasources each technique has. Furthermore, this method might be used for one of the other scores, which may have more than two attributes. It is not too difficult to generalize this to work with three or more attributes.

Suppose we have 5 attributes, named 𝑎, 𝑏, 𝑐, 𝑑, and 𝑒, and each attribute has an upper and lower cutoff. The steps to defining their weights are:
![d13f8e0a-5df5-4084-b4be-171b64f6246c](https://user-images.githubusercontent.com/86126040/166452540-e2e38716-4d6e-4744-a2a2-4d834e888785.png)
This is a contour plot of actionability scores -- patches of the same color have (roughly) the same value of actionability

- Actionability ranges from zero to one. This will make things much easier when it comes time to combine the scores from actionability, chokepoint and so on.
- You can see that the highest score that a technique with no mitigations can have is about 0.45
![Actionability16](https://user-images.githubusercontent.com/86126040/166452592-07ca9b02-0aab-4f4d-b466-ff85209f67f7.png)
Here's what actionability would look like if we didn't use utility functions to scale detections and mitigations. We can see that actionability is now unbounded, which will make things difficult to combine later on. Also, even if a technique has zero mitigations, it could still recieve a high actionability score if its detections is high enough.
![Actionability18](https://user-images.githubusercontent.com/86126040/166452611-7f60e40a-f29d-403a-878d-6c4872c7f546.png)
