<#
.Synopsis
    Searches through Developer Apps for Apps with No API Products associated with them.
.DESCRIPTION
    Searches through Developer Apps for Apps with No API Products associated with them.
.EXAMPLE
    DeveloperApps-NoApiProducts
#>
function DevApps-NoApiProducts
{
    [CmdletBinding()]
    Param
    (
        [Parameter(Mandatory = $true)]
        [ValidateSet("no","approved","pending","revoked")]
        [string] $Status
    )

    Import-Module ApigeeUcsb

    # Create a hashtable for the results
    $result = @{}
    
    # Use try/catch block            
    try
    {
        #$Error.Clear()
        #Clear-Log
        #Write-Log "Status: $Status"

        $found = @()

        $developerEmails = Get-ApigeeDeveloperEmails

        foreach($email in $developerEmails) {
            $developer = Get-ApigeeDeveloper -Email $email

            foreach($appName in $developer.Apps) {
                $devApp = Get-ApigeeDeveloperApp -Email $email -AppName $appName

                switch($Status) {
                    "no" {
                        if(         $devApp.credentials.Count -gt 0 `
                            -and    $devApp.credentials[0].apiProducts.Count -eq 0 `
                        ) {
                            $props = @{
                                Developer = $email;
                                DeveloperApplication = $appName;
                            }
                            $noProductObj = New-Object PSCustomObject -Property $props
                            $found += @($noProductObj)
                        }
                    }

                    default {
                        foreach($cred in $devApp.credentials) {
                            foreach($apiProduct in $cred.apiProducts) {
                                Write-Log "API Product: $apiProduct"
                                $props = @{
                                        Developer = $email;
                                        DeveloperApplication = $appName;
                                        ApiProduct = $apiProduct.apiproduct;
                                        Status = $apiProduct.status;
                                    }

                                $statusObj = New-Object PSCustomObject -Property $props

                                Write-Log ($statusObj | Out-String | Format-Outstring)

                                if($apiProduct.status -eq $Status) {
                                    $found += @($statusObj)
                                }
                            }
                        }
                    }
                }
            }
        }

        # Create a string for sending back to slack. * and ` are used to make the output look nice in Slack. Details: http://bit.ly/MHSlackFormat
        if(@($found).Count -eq 0) {
            $result.output = "No results found"
        } else {
            switch($Status) {
                "no" {
                    $outstring = $found | ft -AutoSize Developer, DeveloperApplication | Out-String
                }
                default {
                    $outstring = $found | ft -AutoSize Developer, DeveloperApplication, Status, ApiProduct | Out-String
                }
            }
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