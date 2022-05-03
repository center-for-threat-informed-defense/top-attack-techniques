# Top Attack Technique Methodology
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








