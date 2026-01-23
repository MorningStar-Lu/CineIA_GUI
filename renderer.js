const btnSelectInput = document.getElementById('btn-select-input');
const btnSelectOutput = document.getElementById('btn-select-output');
const inputPathEl = document.getElementById('input-path');
const outputPathEl = document.getElementById('output-path');
const btnStart = document.getElementById('btn-start');
const terminal = document.getElementById('log-terminal');
const btnClearLogs = document.getElementById('btn-clear-logs');

// Readme & License Elements
const btnHelp = document.getElementById('btn-help');
const btnLicense = document.getElementById('btn-license');
const modalReadme = document.getElementById('readme-modal');
const btnCloseReadme = document.getElementById('btn-close-readme');
const readmeContentCn = document.getElementById('readme-content-cn');
const readmeContentEn = document.getElementById('readme-content-en');
const modalLicense = document.getElementById('license-modal');
const btnCloseLicense = document.getElementById('btn-close-license');

// Settings (Hidden/Legacy)
const modalSettings = document.getElementById('settings-modal');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');
const inputCineiaPath = document.getElementById('settings-cineia-path');

// State
let isRunning = false;
let cineiaPath = localStorage.getItem('cineia-path') || '';

// Load saved settings
if (cineiaPath) {
    inputCineiaPath.value = cineiaPath;
}

// Helpers
function addLog(text, type = 'normal') {
    const line = document.createElement('div');
    line.classList.add('log-line');
    if (type === 'error') line.classList.add('error');
    if (type === 'info') line.classList.add('info');
    if (type === 'success') line.classList.add('success');
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

// Translations
const translations = {
    'en': {
        'status-ready': 'Ready',
        'btn-help': 'Help',
        'btn-license': 'License',
        'modal-help': 'Instructions',
        'modal-license': 'License / Copyright',
        'section-files': 'File Selection',
        'label-input': 'Input File (IMF IAB .mxf)',
        'btn-select-file': 'Select File',
        'label-output': 'Output File (DCP IAB .mxf)',
        'btn-select-path': 'Select Path',
        'section-options': 'Conversion Options',
        'desc-no-copy': 'Do not copy PreambleValue, attempt to fix abnormal bitstream',
        'desc-force-dolby': 'Force Dolby Constraint (Can cause errors)',
        'btn-start': 'Start Conversion',
        'btn-converting': 'Converting...',
        'status-preparing': 'Preparing...',
        'status-processing': 'Processing...',
        'section-logs': 'Logs',
        'btn-clear': 'Clear',
        'log-waiting': 'Waiting to start...',
        'modal-settings': 'Settings',
        'label-cli-path': 'CineIA CLI Path',
        'hint-cli-path': 'If the system cannot find the `cineia` command, specify the full path here.',
        'btn-save': 'Save',
        'placeholder-input': 'Drag or select .mxf file',
        'placeholder-output': 'Set output path',
        'tooltip-channels': 'Set Bed Channels count in MXF AtmosDescriptor. Default: 10.\nDo not change unless you face compatibility issues.',
        'tooltip-objects': 'Set Objects count in MXF AtmosDescriptor. Default: 118.\nDo not change unless you face compatibility issues.',
        'log-input-selected': 'Input selected: ',
        'log-output-selected': 'Output selected: ',
        'log-error-paths': 'Error: Please select input and output paths first.',
        'log-start': 'Starting conversion task...',
        'log-settings-updated': 'Settings updated: CLI Path = ',
        'log-success': 'Conversion Successful',
        'log-finished': 'Job Finished! (Exit Code: ',
        'log-error-generic': 'Job ended with potential errors. (Exit Code: ',
        'time-elapsed': 'Elapsed: ',
        'time-remaining': 'Remaining: '
    },
    'zh': {
        'status-ready': 'Ready',
        'btn-help': '说明',
        'btn-license': '版权',
        'modal-help': '使用说明',
        'modal-license': '版权声明',
        'section-files': '文件选择',
        'label-input': '输入文件 (IMF IAB .mxf)',
        'btn-select-file': '选择文件',
        'label-output': '输出文件 (DCP IAB .mxf)',
        'btn-select-path': '选择路径',
        'section-options': '转换选项',
        'desc-no-copy': '不复制 PreambleValue，尝试修复异常比特流',
        'desc-force-dolby': '强制符合杜比约束 (可能导致错误)',
        'btn-start': '开始转换',
        'btn-converting': '转换中...',
        'status-preparing': '准备中...',
        'status-processing': '处理中...',
        'section-logs': '运行日志',
        'btn-clear': '清除',
        'log-waiting': '等待开始...',
        'modal-settings': '设置',
        'label-cli-path': 'CineIA CLI 路径',
        'hint-cli-path': '如果系统找不到 `cineia` 命令，请在此指定其完整路径。',
        'btn-save': '保存',
        'placeholder-input': '请选择或拖入 .mxf 文件',
        'placeholder-output': '设置输出路径',
        'tooltip-channels': '设置 MXF AtmosDescriptor 记录的音床声道数 (Bed Channels)。默认:10\n除非遇到兼容性问题，否则请勿修改。',
        'tooltip-objects': '设置 MXF AtmosDescriptor 记录的声音对象数 (Objects)。默认:118\n除非遇到兼容性问题，否则请勿修改。',
        'log-input-selected': '已选择输入文件: ',
        'log-output-selected': '已选择输出路径: ',
        'log-error-paths': '错误: 请先选择输入和输出文件路径。',
        'log-start': '开始转换任务...',
        'log-settings-updated': '设置已更新: CLI 路径 = ',
        'log-success': '转换成功',
        'log-finished': '任务完成! (Exit Code: ',
        'log-error-generic': '任务结束，但在过程中似乎遇到了错误。(Exit Code: ',
        'time-elapsed': '已用: ',
        'time-remaining': '剩余: '
    }
};

let currentLang = localStorage.getItem('app-lang') || 'zh';
const btnLang = document.getElementById('btn-lang');

function applyTranslations() {
    const t = translations[currentLang];

    // Update Button Text
    if (btnLang) {
        btnLang.textContent = currentLang === 'zh' ? 'EN' : 'CN'; // Button shows what you switch TO
    }

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // Update Tooltips
    const tooltipChannels = document.getElementById('tooltip-channels');
    const tooltipObjects = document.getElementById('tooltip-objects');
    if (tooltipChannels) tooltipChannels.setAttribute('data-tip', t['tooltip-channels']);
    if (tooltipObjects) tooltipObjects.setAttribute('data-tip', t['tooltip-objects']);

    // Update Readme Content Visibility (if modal is likely open or for readiness)
    if (readmeContentCn && readmeContentEn) {
        if (currentLang === 'zh') {
            readmeContentCn.classList.remove('hidden');
            readmeContentEn.classList.add('hidden');
        } else {
            readmeContentCn.classList.add('hidden');
            readmeContentEn.classList.remove('hidden');
        }
    }
}

// Initial Apply
applyTranslations();

if (btnLang) {
    btnLang.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('app-lang', currentLang);
        applyTranslations();
    });
}

// Help Modal Logic
function openHelp() {
    modalReadme.classList.remove('hidden');
    // Update content visibility based on CURRENT language
    if (currentLang === 'zh') {
        readmeContentCn.classList.remove('hidden');
        readmeContentEn.classList.add('hidden');
    } else {
        readmeContentCn.classList.add('hidden');
        readmeContentEn.classList.remove('hidden');
    }
}

if (btnHelp) {
    btnHelp.addEventListener('click', openHelp);
}

function closeReadme() {
    modalReadme.classList.add('hidden');
}

if (btnCloseReadme) btnCloseReadme.addEventListener('click', closeReadme);
if (modalReadme) {
    modalReadme.addEventListener('click', (e) => {
        if (e.target === modalReadme) closeReadme();
    });
}

// License Modal Logic
if (btnLicense) {
    btnLicense.addEventListener('click', () => {
        modalLicense.classList.remove('hidden');
    });
}

function closeLicense() {
    modalLicense.classList.add('hidden');
}

if (btnCloseLicense) btnCloseLicense.addEventListener('click', closeLicense);
if (modalLicense) {
    modalLicense.addEventListener('click', (e) => {
        if (e.target === modalLicense) closeLicense();
    });
}

// Settings Logic (Preserved but inaccessible via UI for now)
if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => modalSettings.classList.add('hidden'));
if (modalSettings) {
    modalSettings.addEventListener('click', (e) => {
        if (e.target === modalSettings) modalSettings.classList.add('hidden');
    });
}

if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
        const t = translations[currentLang];
        cineiaPath = inputCineiaPath.value.trim();
        localStorage.setItem('cineia-path', cineiaPath);
        modalSettings.classList.add('hidden');
        addLog(`${t['log-settings-updated']}${cineiaPath || 'Default/Bundled'}`, 'info');
    });
}

// Event Listeners
btnSelectInput.addEventListener('click', async () => {
    const t = translations[currentLang];
    const filePath = await window.electronAPI.selectInputFile();
    if (filePath) {
        inputPathEl.value = filePath;
        addLog(`${t['log-input-selected']}${filePath}`, 'info');

        // Auto-suggest output path
        if (!outputPathEl.value) {
            const pathParts = filePath.split('.');
            pathParts.pop(); // remove extension
            const defaultOutput = pathParts.join('.') + '_dcp.mxf';
            outputPathEl.value = defaultOutput;
        }
    }
});

btnSelectOutput.addEventListener('click', async () => {
    const t = translations[currentLang];
    const filePath = await window.electronAPI.selectOutputFile();
    if (filePath) {
        outputPathEl.value = filePath;
        addLog(`${t['log-output-selected']}${filePath}`, 'info');
    }
});

btnClearLogs.addEventListener('click', () => {
    terminal.innerHTML = '';
});

btnStart.addEventListener('click', () => {
    if (isRunning) return;

    const inputPath = inputPathEl.value;
    const outputPath = outputPathEl.value;
    const t = translations[currentLang];

    if (!inputPath || !outputPath) {
        addLog(t['log-error-paths'], 'error');
        return;
    }

    const options = {
        noCopyPreamble: document.getElementById('no-copy-preamble').checked,
        forceDolby: document.getElementById('force-dolby').checked,
        channels: document.getElementById('set-channels').value,
        objects: document.getElementById('set-objects').value,
    };

    isRunning = true;
    btnStart.disabled = true;
    btnStart.textContent = t['btn-converting'];
    btnStart.style.opacity = '0.7';

    // Clear logs for new run
    terminal.innerHTML = '';
    addLog(t['log-start'], 'info');

    // Reset Progress UI
    const progressContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressStatus = document.getElementById('progress-status');
    const progressPercent = document.getElementById('progress-percent');
    const progressTime = document.getElementById('progress-time');
    const progressFrame = document.getElementById('progress-frame');

    progressContainer.classList.remove('hidden');
    progressBarFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStatus.textContent = t['status-preparing'];
    progressTime.textContent = '--:--';
    progressFrame.textContent = 'Frame: 0/0';

    // Pass the globally configured path
    window.electronAPI.runCineia({ inputPath, outputPath, options, cineiaPath });

    // Auto-scroll to progress
    setTimeout(() => {
        progressContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
});

// Progress Elements
const progressContainer = document.getElementById('progress-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressStatus = document.getElementById('progress-status');
const progressPercent = document.getElementById('progress-percent');
const progressTime = document.getElementById('progress-time');
const progressFrame = document.getElementById('progress-frame');

function formatBytes(kbStr) {
    // Input is like "117904KB"
    const kb = parseInt(kbStr.replace(/\D/g, ''));
    if (isNaN(kb)) return kbStr;

    const mb = kb / 1024;
    if (mb > 1024) {
        return (mb / 1024).toFixed(2) + ' GB';
    } else {
        return mb.toFixed(1) + ' MB';
    }
}

// IPC Listeners
window.electronAPI.onCineiaOutput((data) => {
    // Clean up the input data
    const lines = data.split('\n');
    const t = translations[currentLang];

    lines.forEach(line => {
        if (!line.trim()) return;

        // Regex to match the progress format:
        // [==========          ] [00m:05s<00m:18s] Frame: 1322/6256 Size: 44024KB
        const progressMatch = line.match(/\[.*\] \[(.*?)\] Frame: (\d+)\/(\d+)\s+Size: (\d+KB)/);

        if (progressMatch) {
            // It's a progress update!
            const [_, timeInfo, currentFrame, totalFrame, sizeInfo] = progressMatch;

            const current = parseInt(currentFrame);
            const total = parseInt(totalFrame);
            const percent = Math.round((current / total) * 100);

            // Parse timeInfo
            // timeInfo ex: 00m:05s<00m:18s
            let formattedTime = timeInfo;
            if (timeInfo.includes('<')) {
                const [elapsed, remaining] = timeInfo.split('<');
                formattedTime = `${t['time-elapsed']}${elapsed} | ${t['time-remaining']}${remaining}`;
            }

            // Format size
            const formattedSize = formatBytes(sizeInfo);

            // Update UI
            progressContainer.classList.remove('hidden');
            progressBarFill.style.width = `${percent}%`;
            progressPercent.textContent = `${percent}%`;
            progressStatus.textContent = `${t['status-processing']} (${formattedSize})`;
            progressTime.textContent = formattedTime;
            progressFrame.textContent = `Frame: ${currentFrame} / ${totalFrame}`;
        } else {
            // Normal log line
            addLog(line);
        }
    });
});

window.electronAPI.onCineiaExit((code) => {
    isRunning = false;
    const t = translations[currentLang];
    btnStart.disabled = false;
    btnStart.textContent = t['btn-start'];
    btnStart.style.opacity = '1';

    if (code === 0) {
        addLog(`${t['log-finished']}${code})`, 'info');
        // Simple success notification within terminal
        addLog(`✅ ${t['log-success']}`, 'normal');
    } else {
        addLog(`${t['log-error-generic']}${code})`, 'error');
    }
});
