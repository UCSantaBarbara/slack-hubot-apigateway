function Format-Outstring {
    [CmdletBinding()]
    Param(
        [Parameter(ValueFromPipeline = $true)]
        [string] $output
    )
    
    while($output.StartsWith("`r`n")) {
        $output = $output.Substring(2)
    }    

    while($output.EndsWith("`r`n")) {
        $output = $output.Substring(0, $output.Length - 2)
    }

    return $output
}