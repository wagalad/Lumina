// Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // State
    // ----------------------------------------------------
    const state = {
        currentStep: 1,
        totalSteps: 5,
        data: {
            quality: 5,
            bedTime: '23:00',
            wakeTime: '07:00',
            irregularSchedule: false,
            habits: [],
            stressLevel: 5,
            physicalActivity: 30,
            bmiCategory: 'Normal',
            sleepLatency: 15,
            waso: 0
        }
    };

    // ----------------------------------------------------
    // DOM Elements
    // ----------------------------------------------------
    const steps = document.querySelectorAll('.step');
    const progressBar = document.getElementById('progress-bar');
    const qualitySlider = document.getElementById('sleepQuality');
    const qualityValue = document.getElementById('qualityValue');
    const bedTimeInput = document.getElementById('bedTime');
    const wakeTimeInput = document.getElementById('wakeTime');
    const irregularScheduleCheckbox = document.getElementById('irregularSchedule');
    const optionCards = document.querySelectorAll('.option-card');
    
    // New Fields
    const stressSlider = document.getElementById('stressLevel');
    const stressValue = document.getElementById('stressValue');
    const physicalActivityInput = document.getElementById('physicalActivity');
    const bmiCategorySelect = document.getElementById('bmiCategory');
    const sleepLatencyInput = document.getElementById('sleepLatency');
    const wasoInput = document.getElementById('waso');
    
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    // Main Sections
    const questionnaireSection = document.getElementById('questionnaire-section');
    const loadingSection = document.getElementById('loading-section');
    const resultsSection = document.getElementById('results-section');
    
    // Results Elements
    const finalScoreEl = document.getElementById('finalScore');
    const adviceListEl = document.getElementById('adviceList');

    // ----------------------------------------------------
    // Initialization
    // ----------------------------------------------------
    updateProgressBar();

    // ----------------------------------------------------
    // Event Listeners
    // ----------------------------------------------------
    
    // 1. Sliders
    qualitySlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        qualityValue.textContent = val;
        state.data.quality = val;
    });

    if (stressSlider) {
        stressSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            stressValue.textContent = val;
            state.data.stressLevel = val;
        });
    }

    // 2. Navigation Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(e.target.dataset.next, 10);
            goToStep(nextStep);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prevStep = parseInt(e.target.dataset.prev, 10);
            goToStep(prevStep);
        });
    });

    // 3. Option Cards Selection
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            const val = this.dataset.value;
            
            if (this.classList.contains('selected')) {
                if (!state.data.habits.includes(val)) {
                    state.data.habits.push(val);
                }
            } else {
                state.data.habits = state.data.habits.filter(h => h !== val);
            }
        });
    });

    // 4. Final Form Submission
    analyzeBtn.addEventListener('click', () => {
        try {
            // Collect times, checkbox, and new fields
            state.data.bedTime = bedTimeInput ? bedTimeInput.value : '23:00';
            state.data.wakeTime = wakeTimeInput ? wakeTimeInput.value : '07:00';
            state.data.irregularSchedule = irregularScheduleCheckbox ? irregularScheduleCheckbox.checked : false;
            
            state.data.physicalActivity = physicalActivityInput ? parseInt(physicalActivityInput.value, 10) || 0 : 30;
            state.data.bmiCategory = bmiCategorySelect ? bmiCategorySelect.value : 'Normal';
            state.data.sleepLatency = sleepLatencyInput ? parseInt(sleepLatencyInput.value, 10) || 0 : 15;
            state.data.waso = wasoInput ? parseInt(wasoInput.value, 10) || 0 : 0;

            console.log('Data collected:', state.data);

            // Transition to Loading
            questionnaireSection.classList.add('hidden');
            setTimeout(() => {
                questionnaireSection.style.display = 'none';
                loadingSection.style.display = 'block';
                
                // Allow display change before removing hidden
                requestAnimationFrame(() => {
                    loadingSection.classList.remove('hidden');
                });
                
                processData();
            }, 400); // Wait for fade out
        } catch (e) {
            console.error('Error during analysis step:', e);
            // Fallback emergency transition
            questionnaireSection.style.display = 'none';
            loadingSection.style.display = 'block';
            loadingSection.classList.remove('hidden');
            processData();
        }
    });

    // 5. Restart
    restartBtn.addEventListener('click', () => {
        // Simple refresh to start completely clean, or reset state manually
        window.location.reload();
    });

    // ----------------------------------------------------
    // Functions
    // ----------------------------------------------------

    function goToStep(stepNum) {
        // Hide current step
        const currentActive = document.querySelector('.step.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        // Show new step
        const newStep = document.getElementById(`step-${stepNum}`);
        if (newStep) {
            newStep.classList.add('active');
            state.currentStep = stepNum;
            updateProgressBar();
        }
    }

    function updateProgressBar() {
        const percentage = ((state.currentStep - 1) / (state.totalSteps)) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    function processData() {
        // The data.js function is available on window
        const results = window.analyzeSleepData(state.data);
        
        // Simulate network delay for effect (2 seconds)
        setTimeout(() => {
            renderResults(results);
            
            // Transition from Loading to Results
            loadingSection.classList.add('hidden');
            setTimeout(() => {
                loadingSection.style.display = 'none';
                resultsSection.style.display = 'block';
                
                requestAnimationFrame(() => {
                    resultsSection.classList.remove('hidden');
                });
            }, 400);

        }, 2000);
    }

    function renderResults(results) {
        // ---- Populate Metrics Grid ----
        const durationEl = document.getElementById('metricDuration');
        const efficiencyEl = document.getElementById('metricEfficiency');
        const solEl = document.getElementById('metricSOL');
        const wasoEl = document.getElementById('metricWASO');

        if (durationEl) durationEl.textContent = results.duration;
        if (solEl) solEl.textContent = state.data.sleepLatency;
        if (wasoEl) wasoEl.textContent = state.data.waso;

        // Calculate sleep efficiency: (TST / TIB) * 100
        const tib = results.duration + (state.data.sleepLatency / 60) + (state.data.waso / 60);
        const efficiency = tib > 0 ? Math.round((results.duration / tib) * 100) : 0;
        if (efficiencyEl) efficiencyEl.textContent = efficiency;

        // ---- Animate Score ----
        let currentScore = 0;
        finalScoreEl.textContent = '0';
        
        const animDuration = 1500;
        const animInterval = 20;
        const step = results.score / (animDuration / animInterval);
        
        const timer = setInterval(() => {
            currentScore += step;
            if (currentScore >= results.score) {
                currentScore = results.score;
                clearInterval(timer);
            }
            finalScoreEl.textContent = Math.round(currentScore);
        }, animInterval);

        // ---- Render Advice Cards ----
        adviceListEl.innerHTML = '';

        // Always add general positive tips that complement the matched advice
        const generalTips = [
            {
                type: 'info',
                title: 'Optimal Room Temperature',
                text: 'Research shows the ideal bedroom temperature is 60–67°F (15–19°C). Your body needs to drop its core temperature by 1-2°F to initiate sleep.'
            },
            {
                type: 'info',
                title: 'The 90-Minute Sleep Cycle',
                text: 'Each sleep cycle lasts approximately 90 minutes. Try to time your sleep in multiples of 90 minutes (e.g., 7.5h or 9h) so you wake at the end of a cycle feeling refreshed, not groggy.'
            },
            {
                type: 'info',
                title: 'REM Sleep Matters',
                text: 'REM sleep makes up 20-25% of total sleep in healthy adults. It is critical for memory consolidation, emotional regulation, and creativity. Most REM occurs in the second half of the night.'
            }
        ];

        // Combine matched advice with general tips (avoid duplicates by title)
        const existingTitles = new Set(results.advice.map(a => a.title));
        const combinedAdvice = [...results.advice];
        generalTips.forEach(tip => {
            if (!existingTitles.has(tip.title)) {
                combinedAdvice.push(tip);
            }
        });

        combinedAdvice.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = `advice-card ${item.type}`;
            card.style.animationDelay = `${i * 0.1}s`;
            
            const title = document.createElement('h3');
            title.textContent = item.title;
            
            const text = document.createElement('p');
            text.textContent = item.text;
            
            card.appendChild(title);
            card.appendChild(text);
            adviceListEl.appendChild(card);
        });

        // ---- Render "Did You Know?" Facts ----
        const factsListEl = document.getElementById('factsList');
        if (factsListEl) {
            const allFacts = [
                // Sleep Foundation & General
                { icon: '📊', text: '<strong>1 in 3 adults</strong> don\'t get enough sleep. The CDC recommends at least 7 hours per night for adults aged 18-60. <em>(National Sleep Foundation)</em>' },
                { icon: '☕', text: '<strong>94% of Americans</strong> drink caffeinated beverages. Caffeine has a half-life of 4-6 hours and blocks adenosine receptors that promote sleep pressure. <em>(National Sleep Foundation)</em>' },
                { icon: '🍷', text: 'Alcohol before bed can <strong>decrease sleep quality by 39%</strong>. It suppresses REM sleep in the first half of the night, causing fragmented cycles. <em>(National Sleep Foundation)</em>' },
                { icon: '🥜', text: 'Adults who snack on <strong>seeds and nuts</strong> before bed sleep <strong>32 minutes more</strong> on average than those who snack on chips or pretzels. <em>(National Sleep Foundation)</em>' },
                { icon: '🛏️', text: 'Eating within <strong>2 hours of bedtime</strong> is linked to later bedtimes, trouble falling and staying asleep, and obesity. <em>(National Sleep Foundation)</em>' },
                { icon: '💤', text: 'On average, we spend about <strong>2 hours per night dreaming</strong>, mostly during REM sleep. Deep sleep decreases as you age. <em>(National Sleep Foundation)</em>' },
                { icon: '📱', text: 'Blue light from screens suppresses melatonin production by up to <strong>50%</strong>. Using night mode helps, but putting screens away 45 min before bed is most effective. <em>(National Sleep Foundation)</em>' },
                // Kaggle
                { icon: '🏃', text: 'People who exercise for <strong>30+ minutes daily</strong> score significantly higher on sleep quality indexes. <em>(Kaggle Sleep Health Dataset)</em>' },
                { icon: '😰', text: 'There is a <strong>strong inverse correlation</strong> between daily stress levels and sleep quality scores. Stress management is one of the most impactful sleep interventions. <em>(Kaggle Sleep Health Dataset)</em>' },
                // NSRR / SHHS
                { icon: '🔬', text: 'The <strong>Sleep Heart Health Study (SHHS)</strong> tracked 6,441 participants and found strong links between sleep-disordered breathing and cardiovascular disease, stroke, and hypertension. <em>(NSRR/SHHS)</em>' },
                { icon: '🧬', text: 'The <strong>Cleveland Family Study</strong> (2,284 participants, 46% African American) found that sleep apnea has a significant <strong>familial/genetic component</strong> — your family history matters. <em>(NSRR)</em>' },
                { icon: '👴', text: 'The <strong>MrOS Sleep Study</strong> found that sleep-disordered breathing in elderly men is strongly linked to <strong>increased fracture risk and mortality</strong>. <em>(NSRR)</em>' },
                // HSP / BDSP
                { icon: '🧠', text: 'The <strong>Human Sleep Project</strong> (26,200+ PSG studies) discovered that sleep EEG can reveal "brain age" — and accelerated brain aging <strong>predicts shorter life expectancy</strong>. <em>(HSP/BDSP, Mass General Hospital)</em>' },
                { icon: '🏥', text: 'HSP researchers are using sleep data to detect early signs of <strong>Alzheimer\'s disease and cerebrovascular disease</strong> before clinical symptoms appear. <em>(HSP/BDSP)</em>' },
                // SleepFM / Nature Medicine
                { icon: '🤖', text: 'The <strong>SleepFM</strong> AI model, trained on 585,000+ hours of sleep data, can predict <strong>130+ diseases</strong> from a single night of sleep — including dementia (C-Index 0.85) and heart failure (0.80). <em>(Nature Medicine, 2026)</em>' },
                { icon: '⚠️', text: 'SleepFM found that sleep data predicts <strong>Parkinson\'s disease</strong> with an AUROC of 0.93 — sleep disorders are increasingly seen as an <strong>early warning sign</strong>. <em>(Nature Medicine, 2026)</em>' },
                { icon: '💀', text: 'Low REM sleep, high arousal burden, and low sleep efficiency are each <strong>independently associated with higher all-cause mortality</strong>. <em>(SleepFM / Nature Medicine, 2026)</em>' },
                // SleepFounder / medRxiv
                { icon: '💓', text: '<strong>~85 million Americans</strong> have obstructive sleep apnea, but about <strong>80% remain undiagnosed</strong>. Heartbeat and breathing patterns alone can detect it. <em>(SleepFounder, medRxiv 2025)</em>' },
                { icon: '🫀', text: 'The <strong>SleepFounder</strong> model showed that cardiorespiratory signals during sleep predict heart failure (AUROC 0.88), GERD (0.89), and high cholesterol (0.83). <em>(medRxiv, 2025)</em>' },
                // ISRUC-Sleep
                { icon: '📉', text: 'PSG recordings in the <strong>ISRUC-Sleep</strong> dataset, scored by two independent experts, show that people with sleep disorders spend <strong>significantly less time in N3 (deep) and REM sleep</strong> stages. <em>(ISRUC-Sleep, Univ. of Coimbra)</em>' }
            ];

            // Pick 5 random facts
            const shuffled = allFacts.sort(() => 0.5 - Math.random());
            const selectedFacts = shuffled.slice(0, 5);

            factsListEl.innerHTML = '';
            selectedFacts.forEach((fact, i) => {
                const card = document.createElement('div');
                card.className = 'fact-card';
                card.style.animationDelay = `${i * 0.15}s`;
                card.innerHTML = `
                    <span class="fact-icon">${fact.icon}</span>
                    <span class="fact-text">${fact.text}</span>
                `;
                factsListEl.appendChild(card);
            });
        }
    }
});

