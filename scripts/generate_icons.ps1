Add-Type -AssemblyName System.Drawing

$sourcePath = "D:\TopUP\frontend\public\tin-logo.png"
if (-not (Test-Path $sourcePath)) {
    $sourcePath = "D:\TopUP\frontend\public\logo.png"
}

Write-Host "Source image: $sourcePath"
$sourceImg = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "Source size: $($sourceImg.Width)x$($sourceImg.Height)"

function Resize-Image($src, $targetPath, $targetWidth, $targetHeight, $format) {
    $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $rect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
    $graphics.DrawImage($src, $rect)
    
    if ($format -eq "ico") {
        $icon = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
        $fileStream = New-Object System.IO.FileStream($targetPath, [System.IO.FileMode]::Create)
        $icon.Save($fileStream)
        $fileStream.Close()
        $icon.Dispose()
    } else {
        $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $targetPath ($($targetWidth)x$($targetHeight))"
}

# 1. Favicon (.ico and .png)
Resize-Image $sourceImg "D:\TopUP\frontend\public\favicon.ico" 48 48 "ico"
Resize-Image $sourceImg "D:\TopUP\frontend\public\favicon.png" 32 32 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\favicon-16x16.png" 16 16 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\favicon-32x32.png" 32 32 "png"

# 2. Apple Touch Icons (iOS Homescreen)
Resize-Image $sourceImg "D:\TopUP\frontend\public\apple-touch-icon.png" 180 180 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\apple-touch-icon-180x180.png" 180 180 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\apple-touch-icon-152x152.png" 152 152 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\apple-touch-icon-120x120.png" 120 120 "png"

# 3. Android PWA Icons (Add to Homescreen)
Resize-Image $sourceImg "D:\TopUP\frontend\public\logo192.png" 192 192 "png"
Resize-Image $sourceImg "D:\TopUP\frontend\public\logo512.png" 512 512 "png"

$sourceImg.Dispose()
Write-Host "All icons generated successfully!"
