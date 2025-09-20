document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const storyboardGrid = document.getElementById('storyboard-grid');
    const timelineTrack = document.getElementById('timeline-track');
    let clipCount = 0;

    // Check if required elements exist
    if (!generateBtn || !storyboardGrid || !timelineTrack) {
        console.error('Required DOM elements not found');
        return;
    }

    generateBtn.addEventListener('click', () => {
        // 1. Gather data from the UI
        const engineSelect = document.getElementById('engine-select');
        const apiKeyInput = document.getElementById('api-key-input');
        const characterInput = document.querySelector('#character-section input');
        const settingInput = document.querySelector('#setting-section input');
        const lightingSelect = document.querySelector('#lighting-section select');
        const moodInput = document.querySelector('#mood-section input');
        const panInput = document.getElementById('pan');
        const tiltInput = document.getElementById('tilt');
        const zoomInput = document.getElementById('zoom');
        const dollyInput = document.getElementById('dolly');

        const ingredients = {
            engine: engineSelect ? engineSelect.value : 'stepfun',
            apiKey: apiKeyInput ? apiKeyInput.value : '',
            character: characterInput ? characterInput.value : '',
            setting: settingInput ? settingInput.value : '',
            lighting: lightingSelect ? lightingSelect.value : 'Cinematic',
            mood: moodInput ? moodInput.value : '',
            camera: {
                pan: panInput ? panInput.value : '0',
                tilt: tiltInput ? tiltInput.value : '0',
                zoom: zoomInput ? zoomInput.value : '1',
                dolly: dollyInput ? dollyInput.value : '0'
            }
        };

        // 2. Show a loading message
        const loadingMessage = document.createElement('p');
        loadingMessage.classList.add('loading-message');
        loadingMessage.textContent = 'Sending request to backend...';
        if (clipCount === 0) {
            storyboardGrid.innerHTML = '';
        }
        storyboardGrid.appendChild(loadingMessage);

        // 3. Send data to the backend
        fetch('http://localhost:5001/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingredients),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            storyboardGrid.removeChild(loadingMessage);

            clipCount++;
            const newClip = document.createElement('div');
            newClip.classList.add('storyboard-panel');

            // Use a video tag to display the mock video from the backend
            newClip.innerHTML = `
                <video src="${data.video_url}" loop muted playsinline controls preload="metadata"></video>
                <div class="panel-info">
                    <p>${data.clip_name} #${clipCount}</p>
                </div>
            `;

            // Make the new clip draggable
            newClip.setAttribute('draggable', 'true');
            newClip.addEventListener('dragstart', handleDragStart);

            // Add the new clip to the storyboard
            storyboardGrid.appendChild(newClip);
        })
        .catch((error) => {
            console.error('Error:', error);
            storyboardGrid.removeChild(loadingMessage);
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'Error: Could not connect to the backend.';
            storyboardGrid.appendChild(errorMessage);
        });
    });

    function handleDragStart(e) {
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    timelineTrack.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
    });

    timelineTrack.addEventListener('drop', (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/html');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;
        const droppedElement = tempDiv.firstChild;

        const newTimelineClip = document.createElement('div');
        newTimelineClip.classList.add('timeline-clip');

        // Handle both video and image-based clips
        const video = droppedElement.querySelector('video');
        const img = droppedElement.querySelector('img');

        if (video) {
            // For video clips, we'll create a simple representation
            newTimelineClip.style.backgroundColor = '#3a3a3a';
            const panelInfo = droppedElement.querySelector('.panel-info p');
            if (panelInfo) {
                newTimelineClip.innerHTML = `<p style="color: #ccc; text-align: center; font-size: 12px; padding: 5px; margin: 0;">${panelInfo.textContent}</p>`;
            }
        } else if (img) {
            // Fallback for old image-based clips
            newTimelineClip.style.backgroundImage = `url(${img.src})`;
        }

        timelineTrack.appendChild(newTimelineClip);
    });

    // --- New Engine Switcher Logic ---
    const engineSelect = document.getElementById('engine-select');
    const getApiKeyLink = document.getElementById('get-api-key-link');

    const apiKeyUrls = {
        'stepfun': 'https://yuewen.cn',
        'qwen': 'https://dashscope.console.aliyun.com'
    };

    const updateApiKeyLink = () => {
        const selectedEngine = engineSelect.value;
        if (getApiKeyLink) {
            getApiKeyLink.href = apiKeyUrls[selectedEngine];
        }
    };

    if (engineSelect && getApiKeyLink) {
        // Set the initial link
        updateApiKeyLink();

        // Update link when the selection changes
        engineSelect.addEventListener('change', updateApiKeyLink);
    }
});
