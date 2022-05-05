<h3>Understanding the Spreadsheet</h3>

The [Top ATT&CK Techniques backend spreadsheet](https://github.com/center-for-threat-informed-defense/top-attack-technique/blob/main/TAT%20Backend.xlsx) is the backend for the Top ATT&CK Techniques calculator. This README will explain how can you modify this spreadsheet to have the Top 10 Calculator completely customized to your needs. You should only change cells that are highlighted in yellow. Other changes could break the functionality, so do so at your own risk. 	

<h3>TOP 10 TECHNIQUES</h3>
B15:19 = You can change your monitoring coverage, which will update the Top Technique score and the Ransomware Top Technique score. The options are None, Low, Medium, High.
	
<h3>Methodology</h3>
F:G	= These columns are to adjust the Choke Point score for each technique. Column F is how many techniques happen immediately before that row's technique and column G is how many techniques happen immediately after that row's technique. 
M:M	= This is our Sightings data and is hardcoded. YOU WON'T BE ABLE TO CHANGE THESE VALUES YET.
N:Q, S, U	= These columns are to adjust the Actionability score. Each column represents the number of analytics or controls for each technique. 
AN	= These columns allow you to update the Ransomware Top Technique score. AN is to mark how many ransomware groups have been seen using that row's technique. 
	
<h3>Coverage Definitions</h3>
This sheet describes our definitions for the different levels of network, process, file, hardware, and cloud coverage. This was borrowed from Cyb3rWard0g's work on "How Hot is your Hunt Team"
	
<h3>Techniques</h3>
This sheet is from the ATT&CK page and includes all relavent data for each technique
	
<h3>Parameters</h3>
This sheet has values that feed our components in the Methodology sheet. 

D2:D5 = changes the upper and lower bounds for Actionability. D6 changes the weighted ratio of detections to mitigations. 1 Mitigations = 2 Detections

D8:D11 = changes the upper and lower bounds for Choke Point. D12 changes the weighted ratio of before to after techniques. 1 before = 1 after

D14 = sets the date for which the prevalence methodology should use as ""today's date."" This should reflect the latest date that you have data for prevalence. 

D21:22 = sets the upper and lower bounds for the ranswomare list. The upper bound is how many different groups are in the ransomware data set
