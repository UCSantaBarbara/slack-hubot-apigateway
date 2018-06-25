<#
.Synopsis
    Searches through Developers that were created in the last X days.
.DESCRIPTION
    Searches through Developers that were created in the last X days.
.EXAMPLE
    Devs-Created
#>
function TargetServer-Set
{
    [CmdletBinding()]
    Param
    (
        [Parameter(Mandatory = $true)]
        [ValidateSet("add","update","delete","list")]
        $Action,
        [Parameter(Mandatory = $true)]
        [ValidateSet("dev","test","prod")]
        $Environment,
        $Name = "",
        $HostName = ""
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

        $found = @()
        $jsonResult = $null

        switch($Action) {
            "list" {
                $jsonResult = Get-ApigeeTargetServer -Environment $Environment
            }
            "delete" {
                $jsonResult = Remove-ApigeeTargetServer -Name $Name -Environment $Environment
            }
            default { # "add", "update"
                $jsonResult = New-ApigeeTargetServer -Name $Name -Environment $Environment -HostName $HostName
            }
        }
        

        # Create a string for sending back to slack. * and ` are used to make the output look nice in Slack. Details: http://bit.ly/MHSlackFormat
        $result.output = $jsonResult | Out-String | Format-Outstring
        
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