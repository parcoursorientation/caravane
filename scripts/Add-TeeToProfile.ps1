# Script to add tee function to PowerShell profile
# Run this script with: .\Add-TeeToProfile.ps1

# Check if profile exists, create if not
$profilePath = $PROFILE
if (-not (Test-Path $profilePath)) {
    New-Item -ItemType File -Path $profilePath -Force
    Write-Host "PowerShell profile created at: $profilePath"
}

# Add tee function to profile
$teeFunction = @'

# Unix-like tee command for PowerShell
function tee {
    param(
        [Parameter(ValueFromPipeline=$true)]
        [object]$InputObject,
        
        [Parameter(Mandatory=$true)]
        [string]$FilePath,
        
        [switch]$Append
    )
    
    begin {
        $files = @()
        try {
            if ($Append) {
                $fileStream = [System.IO.File]AppendText($FilePath)
            } else {
                $fileStream = [System.IO.File]CreateText($FilePath)
            }
            $files += $fileStream
        }
        catch {
            Write-Error "Cannot open file $FilePath : $_"
            return
        }
    }
    
    process {
        if ($null -ne $InputObject) {
            # Write to console
            Write-Output $InputObject
            
            # Write to file
            $fileStream.WriteLine($InputObject.ToString())
        }
    }
    
    end {
        $fileStream.Close()
    }
}

# Set-Alias for convenience
Set-Alias -Name tee -Value tee-function

'@

# Add the function to profile if not already present
if (-not (Select-String -Path $profilePath -Pattern "function tee" -SimpleMatch)) {
    Add-Content -Path $profilePath -Value $teeFunction
    Write-Host "Tee function added to PowerShell profile" -ForegroundColor Green
    Write-Host "Please restart PowerShell to use the tee function" -ForegroundColor Yellow
} else {
    Write-Host "Tee function already exists in PowerShell profile" -ForegroundColor Yellow
}

# Instructions
Write-Host @"
Usage examples:
    Get-Process | tee -FilePath processes.txt
    Get-ChildItem | tee -FilePath files.txt -Append
    echo 'Hello World' | tee -FilePath hello.txt
"@ -ForegroundColor Cyan