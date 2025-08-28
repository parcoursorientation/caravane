<#
.SYNOPSIS
    PowerShell equivalent of the Unix 'tee' command
.DESCRIPTION
    Reads from standard input and writes to standard output and files
.PARAMETER FilePath
    One or more files to write the output to
.PARAMETER Append
    Append to the specified files instead of overwriting them
.EXAMPLE
    Get-Content input.txt | .\tee.ps1 output.txt
.EXAMPLE
    echo "Hello World" | .\tee.ps1 -FilePath output1.txt,output2.txt -Append
#>
param(
    [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
    [string[]]$InputObject,
    
    [Parameter(Mandatory=$true)]
    [string[]]$FilePath,
    
    [switch]$Append
)

begin {
    $files = @()
    foreach ($file in $FilePath) {
        try {
            if ($Append) {
                $fileStream = [System.IO.File]::AppendText($file)
            } else {
                $fileStream = [System.IO.File]::CreateText($file)
            }
            $files += $fileStream
        }
        catch {
            Write-Error "Cannot open file $file : $_"
            exit 1
        }
    }
}

process {
    foreach ($line in $InputObject) {
        # Write to console
        Write-Output $line
        
        # Write to files
        foreach ($fileStream in $files) {
            $fileStream.WriteLine($line)
        }
    }
}

end {
    foreach ($fileStream in $files) {
        $fileStream.Close()
    }
}