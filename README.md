<h1>What is Top ATT&CK Techniques?</h1>

In its visual form, Top ATT&CK Techniques is a web-based calculator that allows defenders to generate a list of every technique, prioritized based on user inputs. The user inputs include filters for things like operating system, security controls, analytics, and modifiers for things like process and network monitoring coverage. The calculator displays the top 10 techniques and provides the option to export all techniques in JSON format.  This spreadsheet is the backend for the Top ATT&CK Techniques calculator. This README will explain how can you modify this spreadsheet to have the Top 10 Calculator completely customized to your needs. You should only change cells that are highlighted in yellow. Other changes could break the functionality, so do so at your own risk. 	
![Screen Shot 2022-05-03 at 8 44 17 AM](https://user-images.githubusercontent.com/86126040/166455196-ca3809ea-3e3b-479e-916c-6b9e61cd90f9.png)

<h2>Methodology</h2>

The prioritized list of techniques is the visual representation of a lot of backend math and analysis. The Center’s methodology is composed of three different components. Algorithms for each component were created to determine a technique’s weight within a specific component, and then each component weight was is combined to give an overall weight. Those components are actionability, choke point, and prevalence.  
![Screen Shot 2022-05-03 at 8 44 07 AM](https://user-images.githubusercontent.com/86126040/166455119-5b359777-102c-4321-a316-c6aa5064ec5e.png)

<b>Actionability</b> is defined as the opportunity for a defender to detect or mitigate against eachan ATT&CK technique based on publicly available analytics and security controls. In simpler words, can a defender take action against a technique? To answer this question,  actionability was separated into two categories: detections and mitigations. Publicly available resources were used to identify the total amount number of analytics detections and security controls that mapped to each ATT&CK technique. Techniques that have a greater number of detections and mitigations are weighted more heavily. For detections, analytics were identified from MITRE’s Cyber Analytic Repository, Elastic, Sigma HQ's rules , and Splunk Detections. For mitigations, security controls were selected from CIS Critical Security Controls and NIST 800-53 Security Controls.  
![Screen Shot 2022-05-03 at 8 43 51 AM](https://user-images.githubusercontent.com/86126040/166455229-1e49174e-d60e-45e2-827d-b7a3005ce67f.png)

<b>Choke Point</b> is defined as a specific technique where many other techniques converge or diverge and eliminating that specific technique would cause disruption to an adversary. To determine choke point, open-source threat reports were analyzed to identify techniques that had many other techniques occur directly before and directly after. These techniques can serve as the common denominator in otherwise disparate attacks. For instance, process injection is a choke point because many techniques can occur immediately before it and it can enable many follow-on techniques. Defending against process injection can limit a potential attack path. Techniques with a greater amount of before and after techniques were weighted more heavily. As this project matures, the Center will look to incorporate ATT&CK Flow data into this methodology.  
![Screen Shot 2022-05-03 at 8 43 34 AM](https://user-images.githubusercontent.com/86126040/166455318-15e24572-93d1-41a9-9a48-211c73a7e331.png)

<b>Prevalence</b> is defined as the frequency of which an attacker usesuse for a specific ATT&CK technique over a period of time. This component makes use of real-world data that was gathered for the Sightings Ecosystem project. Frequency analysis was used and adjusted based on recency of the technique’s usage, so a technique seen last week will be weighted higher than a technique seen last month.
![Screen Shot 2022-05-03 at 8 43 24 AM](https://user-images.githubusercontent.com/86126040/166455288-2aa32233-069e-4555-aa08-20561ab13bd0.png)

To view a more indepth look at our methodology, please see the methodology document within this github.


<h2>Putting this to practical use</h2>

Along with giving defenders a tool to help prioritize techniques, the project wanted to put our methodology to practical use and produce a top 10 list that was focused on a specific topic. A ransomware list was selected because ransomware is wide-reaching, indiscriminate, and relevant. This list is the Center’s assessment of which techniques a defender should prioritize to protect themselves against a ransomware attack.  
![Screen Shot 2022-05-03 at 8 46 16 AM](https://user-images.githubusercontent.com/86126040/166455413-d8974ae2-60e2-40c6-b06f-59e020f015d1.png)
To create this ransomware list, the project’s methodology was used and supplemented by adding a separate component that is specific to the Center’s ransomware analysis. To feed this component, CTI (Cyber Threat Intelligence) reporting on 22 different ransomware families was reviewed and extracted techniques that were used during ransomware attacks. The more times a technique was seen across the 22 groups, the higher the weight. 

<h2>A few limitations</h2>

ATT&CK was never created with the intent of assigning values to each technique. It is a compendium of things adversaries have done and gives defenders a common lexicon. Therefore, quantifying the data within ATT&CK is a bit precarious. This project applied discrete values to abstract ideas and generated a weighted score for every technique.  

The data used for this analysis was hardly perfect, which led to some flawed inputs. Flawed inputs lead to flawed outputs, which means that this top 10 list should not be seen as a declaration that you only need to defend against the top 10 techniques. This list should serve as a starting point for a more holistic approach to systematically improving defensive capabilities..  

There are certainly gaps and errors with our approach, but in the Center, we are always trying to advance the state of threat-informed defense. This is our first attempt at creating a methodology to prioritize ATT&CK techniques and we plan to make improvements. To do that, we need your feedback. Please share with us what is working, what isn’t working, and how we can make this more beneficial to you.  




<h2> Understanding the Spreadsheet </h2>

<h3>TOP 10 TECHNIQUES	</h3>
B15:19 = You can change your monitoring coverage, which will update the Top Technique score and the Ransomware Top Technique score. The options are None, Low, Medium, High.
	
<h3>Methodology</h3>
F:G	= These columns are to adjust the Choke Point score for each technique. Column F is how many techniques happen immediately before that row's technique and column G is how many techniques happen immediately after that row's technique. 
M:M	= This is our Sightings data and is hardcoded. YOU WON'T BE ABLE TO CHANGE THESE VALUES YET.
N:Q, S, U	= These columns are to adjust the Actionability score. Each column represents the number of analytics or controls for each technique. 
AN	= These columns allow you to update the Ransomware Top Technique score. AN is to mark how many ransomware groups have been seen using that row's technique. 
	
<h3>Coverage Definitions </h3>
This sheet describes our definitions for the different levels of network, process, file, hardware, and cloud coverage. This was borrowed from Cyb3rWard0g's work on "How Hot is your Hunt Team"
	
<h3>Techniques</h3>
This sheet is from the ATT&CK page and includes all relavent data for each technique
	
<h3>Parameters</h3>
This sheet has values that feed our components in the Methodology sheet. 

D2:D5 = changes the upper and lower bounds for Actionability. D6 changes the weighted ratio of detections to mitigations. 1 Mitigations = 2 Detections

D8:D11 = changes the upper and lower bounds for Choke Point. D12 changes the weighted ratio of before to after techniques. 1 before = 1 after

D14 = sets the date for which the prevalence methodology should use as ""today's date."" This should reflect the latest date that you have data for prevalence. 

D21:22 = sets the upper and lower bounds for the ranswomare list. The upper bound is how many different groups are in the ransomware data set
