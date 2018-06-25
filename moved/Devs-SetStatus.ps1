<#
.Synopsis
    Sets a developer (dev portal developer) to active or inactive
.DESCRIPTION
    Sets a developer (dev portal developer) to active or inactive
.EXAMPLE
    Devs-Created
#>
function Devs-SetStatus
{
    [CmdletBinding()]
    Param
    (
        [Parameter(Mandatory = $true)]
        $Email,
        [Parameter(Mandatory = $true)]
        [ValidateSet("Active","Inactive")]
        $Status
    )

    Import-Module ApigeeUcsb
    Import-Module CoreUcsb

    # Create a hashtable for the results
    $result = @{}
    
    # Use try/catch block            
    try
    {
        #$Error.Clear()
        #Clear-Log
        #Write-Log "Days: $Days"

        $updateResults = Set-ApigeeDeveloperStatus -Email $Email -Status $Status
        
        # Create a string for sending back to slack. * and ` are used to make the output look nice in Slack. Details: http://bit.ly/MHSlackFormat
        $result.output = $updateResults | ft Email, Result -AutoSize | Out-String | Format-Outstring
        
        # Set a successful result
        $result.success = $true

    }
    catch
    {
        #Clear-Log
        #foreach($er in $Error) { Write-Log $er }

        $result.output = $_.Exception.Message
        $result.exceptionMessage = $_.Exception.Message
        
        # Set a failed result
        $result.success = $false
    }
    
    # Return the result and conver it to json
    return $result | ConvertTo-Json
    
}