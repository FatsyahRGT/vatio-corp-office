# Vatio Corp: Quick Memory Status Inspector (PowerShell Windows)
# Fokus: Efisiensi Konteks, Minimalis, dan Kemudahan Audit (Graphify Ready)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "        STATUS TIERED MEMORY VATIO CORP         " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n[TIER 1] MASTER BLUEPRINT:" -ForegroundColor Yellow
Write-Host "Location: ./sys-agents/SYSTEM_CONTEXT.md" -ForegroundColor DarkGray
$tier1 = "./sys-agents/SYSTEM_CONTEXT.md"
if (Test-Path $tier1) {
    Get-Content $tier1 -TotalCount 14
} else {
    Write-Host "File belum dibuat." -ForegroundColor Red
}

Write-Host "`n-------------------------------------------------" -ForegroundColor Gray
Write-Host "[TIER 2] SPRINT WORKING MEMORY:" -ForegroundColor Yellow
Write-Host "Location: ./sys-agents/SPRINT_LOG.md" -ForegroundColor DarkGray
$tier2 = "./sys-agents/SPRINT_LOG.md"
if (Test-Path $tier2) {
    Get-Item $tier2 | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
    Write-Host "Preview Log:" -ForegroundColor DarkGray
    Get-Content $tier2 -TotalCount 8
} else {
    Write-Host "File belum dibuat." -ForegroundColor Red
}

Write-Host "`n-------------------------------------------------" -ForegroundColor Gray
Write-Host "[TIER 3] COLD ARCHIVE SUMMARY:" -ForegroundColor Yellow
Write-Host "Location: ./sys-agents/archive/" -ForegroundColor DarkGray
$archiveDir = "./sys-agents/archive"
if (Test-Path $archiveDir) {
    $archives = Get-ChildItem -Path $archiveDir -Filter "HISTORY_*.md" -ErrorAction SilentlyContinue
    $count = if ($archives) { $archives.Count } else { 0 }
    Write-Host "Jumlah File Arsip: $count" -ForegroundColor Green
    if ($count -gt 0) {
        $archives | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
    }
} else {
    Write-Host "Direktori archive belum ada." -ForegroundColor Red
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "9Router Protocol: Ready | Graphify Sync: Active" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
