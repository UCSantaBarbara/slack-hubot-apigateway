
function Clear-Log {
    $path = "D:\Temp\Log-Apigee.log"
    if(Test-Path $path) {
        del $path -force -erroraction silentlycontinue
    }
}
function Write-Log {
    Param([string] $Line)

    $path = "D:\Temp\Log-Apigee.log"
    if((Test-Path $path) -eq $false) {
        $current = @()
    } else {
        $current = Get-Content $path
    }

    if($Line.EndsWith("`r") -eq $false) {
        $Line = $Line + "`r"
    }
    
    $current += @($Line)

    $current | Set-Content $path -Force
}