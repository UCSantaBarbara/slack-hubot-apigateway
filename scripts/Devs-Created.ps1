<#
.Synopsis
    Searches through Developers that were created in the last X days.
.DESCRIPTION
    Searches through Developers that were created in the last X days.
.EXAMPLE
    Devs-Created
#>
function Devs-Created
{
    [CmdletBinding()]
    Param
    (
        [Parameter(Mandatory = $false)]
        [int] $Days = 1
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

        $daysAgo = -1 * $days
        $compareDate = [DateTime]::Now.AddDays($daysAgo)
        $developerEmails = Get-ApigeeDeveloperEmails

        foreach($email in $developerEmails) {
            $developer = Get-ApigeeDeveloper -Email $email

            $createdDate = ConvertFrom-JsonDate $developer.createdAt
            if($createdDate -gt $compareDate) {
                $props = @{
                    Developer = $email
                    Created = $createdDate
                }
                $newDevObj = New-Object PSCustomObject -Property $props
                $found += @($newDevObj)
            }
        }

        # Create a string for sending back to slack. * and ` are used to make the output look nice in Slack. Details: http://bit.ly/MHSlackFormat
        if(@($found).Count -eq 0) {
            $result.output = "No results found"
        } else {
            $outstring = $found | ft -AutoSize Developer, Created | Out-String
            $result.output = $outstring | Format-Outstring
        }
        
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