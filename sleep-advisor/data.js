// Sleep Advice Database and Logic

const sleepAdviceDB = [
    {
        id: 'quality_low',
        condition: (data) => data.quality <= 4,
        type: 'warning',
        title: 'Focus on Sleep Environment',
        text: (data) => 'Your reported sleep quality is quite low. Start by optimizing your bedroom: keep it completely dark, quiet, and cool (around 65°F / 18°C).'
    },
    {
        id: 'quality_med',
        condition: (data) => data.quality > 4 && data.quality <= 7,
        type: 'info',
        title: 'Room for Improvement',
        text: (data) => 'Your sleep quality is average. Small adjustments to your evening routine could make a significant difference in how refreshed you feel.'
    },
    {
        id: 'quality_high',
        condition: (data) => data.quality > 7,
        type: 'success',
        title: 'Great Baseline',
        text: (data) => 'You maintain good sleep quality! Keep up your current core habits while fine-tuning the edges.'
    },
    {
        id: 'duration_short',
        condition: (data) => data.durationHours < 7,
        type: 'warning',
        title: 'Sleep Duration Too Short',
        text: (data) => `You only get around ${data.durationHours} hours of sleep. Most adults require 7-9 hours. Try shifting your bedtime 15 minutes earlier every few days.`
    },
    {
        id: 'irregular_schedule',
        condition: (data) => data.irregularSchedule,
        type: 'warning',
        title: 'Circadian Rhythm Disruption',
        text: (data) => 'An irregular schedule throws off your internal clock (circadian rhythm). Consistency is king. Try to wake up within the same 30-minute window every day, even on weekends.'
    },
    {
        id: 'habit_screens',
        condition: (data) => data.habits.includes('screens'),
        type: 'warning',
        title: 'Digital Curfew Needed',
        text: (data) => 'Blue light from screens suppresses melatonin (your sleep hormone). Try to replace screen time with reading a physical book or listening to a podcast 45 minutes before bed.'
    },
    {
        id: 'habit_caffeine',
        condition: (data) => data.habits.includes('caffeineLate'),
        type: 'warning',
        title: 'Beware the Half-Life of Caffeine',
        text: (data) => 'Caffeine has a half-life of 5-7 hours. Blocking adenosine receptors in the late afternoon prevents the buildup of sleep pressure. Cut off caffeine entirely after 12 PM - 2 PM.'
    },
    {
        id: 'habit_alcohol',
        condition: (data) => data.habits.includes('alcohol'),
        type: 'warning',
        title: 'Alcohol Destroys Sleep Architecture',
        text: (data) => 'While alcohol might help you fall asleep faster, it drastically reduces REM sleep and fragments your sleep cycles overnight. Try herbal tea instead.'
    },
    {
        id: 'habit_heavyMeal',
        condition: (data) => data.habits.includes('heavyMeal'),
        type: 'warning',
        title: 'Digestion Overdrive',
        text: (data) => 'Eating heavy meals late forces your body to focus on digestion rather than restorative sleep processes. Aim to finish dinner 3 hours before sleep.'
    },
    {
        id: 'habit_workoutLate',
        condition: (data) => data.habits.includes('workoutLate'),
        type: 'warning',
        title: 'Elevated Core Temperature',
        text: (data) => 'Intense exercise raises your core body temperature and heart rate. Your body needs to cool down by 1-2 degrees to initiate sleep. Shift intense workouts to the morning or late afternoon.'
    },
    // ---- Kaggle Dataset Insights ----
    {
        id: 'kaggle_stress',
        condition: (data) => data.stressLevel >= 7,
        type: 'warning',
        title: 'High Stress Correlation (Kaggle Dataset)',
        text: (data) => 'High daily stress strongly correlates with poor sleep quality and reduced duration. Consider mindfulness, meditation, or journaling before bed to lower cortisol levels.'
    },
    {
        id: 'kaggle_activity',
        condition: (data) => data.physicalActivity < 30,
        type: 'info',
        title: 'Increase Daytime Activity (Kaggle Dataset)',
        text: (data) => 'Data shows people with less than 30 minutes of daily physical activity experience lower sleep scores. Adding a 30-minute brisk walk can significantly increase deep sleep.'
    },
    {
        id: 'kaggle_bmi',
        condition: (data) => data.bmiCategory === 'Obese' || data.bmiCategory === 'Overweight',
        type: 'warning',
        title: 'BMI and Sleep Apnea Risk (Kaggle Dataset)',
        text: (data) => `Based on a BMI category of "${data.bmiCategory}", you may be at a higher risk for sleep disorders like Obstructive Sleep Apnea (OSA). If you experience loud snoring or daytime fatigue, consult a doctor.`
    },
    // ---- Sleep Research Society (SRS) Insights ----
    {
        id: 'srs_sol',
        condition: (data) => data.sleepLatency > 30,
        type: 'warning',
        title: 'Prolonged Sleep Onset (SRS Actigraphy Data)',
        text: (data) => `Taking ${data.sleepLatency} minutes to fall asleep indicates prolonged Sleep Onset Latency (SOL). Make sure your bedroom is cool, and avoid forcing sleep. If you can't sleep after 20 minutes, get out of bed and do a relaxing activity.`
    },
    {
        id: 'srs_waso',
        condition: (data) => data.waso > 30,
        type: 'warning',
        title: 'High Sleep Fragmentation (SRS Actigraphy Data)',
        text: (data) => `Being awake for ${data.waso} minutes during the night (Wake After Sleep Onset - WASO) significantly lowers sleep efficiency. Limit evening liquids to prevent bathroom trips, and ensure your room is noise and light-proof.`
    },
    // ---- NSRR / SHHS Insights ----
    {
        id: 'nsrr_cardiovascular',
        condition: (data) => data.quality <= 5 && data.durationHours < 7,
        type: 'warning',
        title: 'Cardiovascular Risk from Poor Sleep (NSRR/SHHS)',
        text: (data) => 'The Sleep Heart Health Study (SHHS), tracking 6,441 participants, found that short sleep duration combined with poor quality is strongly associated with increased risk of coronary heart disease, stroke, and hypertension. Prioritizing 7+ hours of quality sleep is a protective cardiovascular measure.'
    },
    {
        id: 'nsrr_sdb',
        condition: (data) => data.waso > 20 && (data.bmiCategory === 'Obese' || data.bmiCategory === 'Overweight'),
        type: 'warning',
        title: 'Sleep-Disordered Breathing Risk (NSRR/SHHS)',
        text: (data) => 'NSRR data from the SHHS and MrOS studies shows that frequent nighttime awakenings combined with higher BMI significantly increase the risk of sleep-disordered breathing (SDB). SDB is linked to cardiovascular disease and all-cause mortality. Consider a sleep study if you snore loudly or feel exhausted despite adequate time in bed.'
    },
    // ---- HSP / BDSP Insights ----
    {
        id: 'hsp_neuro',
        condition: (data) => data.quality <= 4 && data.stressLevel >= 7,
        type: 'warning',
        title: 'Neurological Health & Sleep (HSP/BDSP)',
        text: (data) => 'Research from the Human Sleep Project (26,200+ PSG studies, Massachusetts General Hospital) shows that chronic poor sleep quality combined with high stress is associated with accelerated \'brain aging\' and increased risk of cerebrovascular disease and Alzheimer\'s. Improving sleep may serve as a neuroprotective intervention.'
    },
    {
        id: 'hsp_brain_age',
        condition: (data) => data.durationHours < 6,
        type: 'info',
        title: 'Sleep Duration & Brain Age (HSP/BDSP)',
        text: (data) => `At ${data.durationHours} hours, you\'re well below optimal duration. HSP data shows that EEG-derived "brain age" from sleep studies predicts life expectancy — consistently sleeping under 6 hours accelerates biological brain aging. Even small increases in sleep duration can help reverse this trend.`
    },
    // ---- SleepFM / Nature Medicine Insights ----
    {
        id: 'sleepfm_disease',
        condition: (data) => data.quality <= 3,
        type: 'warning',
        title: 'Sleep as a Disease Predictor (SleepFM, Nature Medicine 2026)',
        text: (data) => 'A landmark 2026 study in Nature Medicine found that a single night of sleep data can predict 130+ future health conditions, including dementia (C-Index 0.85), heart failure (0.80), and chronic kidney disease (0.79). Very poor sleep quality is not just an inconvenience — it\'s a clinical signal. Discuss your sleep with a healthcare provider.'
    },
    {
        id: 'sleepfm_rem',
        condition: (data) => data.durationHours < 7 && data.habits.includes('alcohol'),
        type: 'warning',
        title: 'REM Sleep & Mortality Risk (SleepFM Research)',
        text: (data) => 'SleepFM research demonstrated a strong association between low REM sleep and all-cause mortality. Alcohol suppresses REM sleep, and short sleep duration further reduces the window for REM cycles (which concentrate in the second half of the night). This combination is particularly harmful.'
    },
    // ---- SleepFounder / medRxiv Insights ----
    {
        id: 'sleepfounder_apnea',
        condition: (data) => data.bmiCategory === 'Obese' && data.waso > 15,
        type: 'warning',
        title: 'Undiagnosed Sleep Apnea Risk (SleepFounder Research)',
        text: (data) => 'The SleepFounder study analyzed 780,000+ hours of multi-ethnic sleep recordings and warns that ~85 million Americans have obstructive sleep apnea, ~80% undiagnosed. Your combination of higher BMI and nighttime awakenings are key risk indicators. A sleep study or home monitoring test could be life-changing.'
    },
    {
        id: 'sleepfounder_cardio',
        condition: (data) => data.quality <= 5 && data.stressLevel >= 6 && data.physicalActivity < 30,
        type: 'info',
        title: 'Cardiorespiratory Signals & Health (SleepFounder Research)',
        text: (data) => 'The SleepFounder model (medRxiv 2025) showed that heartbeat and respiratory patterns during sleep predict heart failure (AUROC 0.88), high cholesterol (0.83), and coronary heart disease (0.81). Poor sleep quality, high stress, and low activity together amplify cardiovascular risk. Improving any one factor can help.'
    },
    // ---- ISRUC-Sleep Insights ----
    {
        id: 'isruc_architecture',
        condition: (data) => data.waso > 20 && data.sleepLatency > 20,
        type: 'info',
        title: 'Sleep Architecture Disruption (ISRUC-Sleep Dataset)',
        text: (data) => 'PSG data from the ISRUC-Sleep dataset (University of Coimbra) shows that combined high sleep latency and frequent awakenings disrupt normal sleep stage cycling — reducing time in restorative N3 (deep sleep) and REM stages. Stimulus control therapy and consistent wake times can help restore healthy sleep architecture.'
    }
];

function analyzeSleepData(userData) {
    // 1. Calculate duration
    const bedDate = new Date(`2000-01-01T${userData.bedTime}`);
    let wakeDate = new Date(`2000-01-01T${userData.wakeTime}`);
    
    // If wake time is less than bed time, it means they wake up the next day
    if (wakeDate < bedDate) {
        wakeDate = new Date(`2000-01-02T${userData.wakeTime}`);
    }
    
    const durationHours = (wakeDate - bedDate) / (1000 * 60 * 60);
    
    // 2. Prepare enrichment data for rules
    const enrichedData = {
        ...userData,
        durationHours: Math.round(durationHours * 10) / 10
    };

    // 3. Generate Advice
    const advice = [];
    sleepAdviceDB.forEach(rule => {
        try {
            if (rule.condition(enrichedData)) {
                advice.push({
                    type: rule.type,
                    title: rule.title,
                    text: typeof rule.text === 'function' ? rule.text(enrichedData) : rule.text
                });
            }
        } catch (e) {
            console.warn('Skipped rule', rule.id, ':', e.message);
        }
    });

    // 4. Calculate Score (Base 100)
    // --- Quality Component (max 35 pts) ---
    // Uses a curve so mid-range quality (5-7) still earns decent points
    const qualityNorm = userData.quality / 10; // 0 to 1
    const qualityScore = Math.round(35 * Math.pow(qualityNorm, 0.7));

    // --- Duration Component (max 25 pts) ---
    // Bell curve centered on 8 hours; 7-9h is the sweet spot
    const optimalDuration = 8;
    const durationDiff = Math.abs(durationHours - optimalDuration);
    let durationScore;
    if (durationDiff <= 1) {
        // 7-9 hours: full or near-full marks
        durationScore = Math.round(25 * (1 - durationDiff * 0.1));
    } else if (durationDiff <= 2) {
        // 6-7h or 9-10h: decent marks
        durationScore = Math.round(25 * (0.7 - (durationDiff - 1) * 0.2));
    } else {
        // < 6h or > 10h: low marks, but never zero
        durationScore = Math.max(3, Math.round(25 * Math.max(0, 0.3 - (durationDiff - 2) * 0.1)));
    }

    // --- Schedule Consistency (max 10 pts) ---
    const scheduleScore = userData.irregularSchedule ? 0 : 10;

    // --- Baseline Bonus (15 pts) ---
    // Everyone starts with some points so scores aren't unreasonably low
    const baselineBonus = 15;

    // --- Deductions (capped at 30) ---
    let deductions = 0;

    // Bad habits: 3 pts each (softer than before)
    deductions += userData.habits.length * 3;

    // Stress: graduated scale instead of binary
    if (userData.stressLevel >= 8) deductions += 8;
    else if (userData.stressLevel >= 6) deductions += 4;
    else if (userData.stressLevel >= 4) deductions += 1;

    // Low physical activity
    if (userData.physicalActivity < 15) deductions += 4;
    else if (userData.physicalActivity < 30) deductions += 2;

    // Sleep onset latency
    if (userData.sleepLatency > 45) deductions += 5;
    else if (userData.sleepLatency > 30) deductions += 3;
    else if (userData.sleepLatency > 20) deductions += 1;

    // WASO (wake after sleep onset)
    if (userData.waso > 45) deductions += 5;
    else if (userData.waso > 30) deductions += 3;
    else if (userData.waso > 15) deductions += 1;

    // Cap total deductions so scores don't crater
    deductions = Math.min(deductions, 30);

    let score = qualityScore + durationScore + scheduleScore + baselineBonus - deductions;
    
    // Ensure bounds
    score = Math.max(10, Math.min(100, score));

    // 5. Score-tiered supplementary advice
    // The lower the score, the more extra tips are provided
    const supplementaryAdvice = [
        {
            minScore: 0, maxScore: 55,
            type: 'warning',
            title: 'Try Sleep Restriction Therapy',
            text: 'Paradoxically, spending less time in bed can improve sleep quality. Limit your time in bed to your actual sleep duration, then gradually extend it by 15 minutes as your efficiency improves. This builds stronger sleep pressure.'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Practice 4-7-8 Breathing',
            text: 'The 4-7-8 technique (inhale 4 sec, hold 7 sec, exhale 8 sec) activates your parasympathetic nervous system and lowers heart rate. Repeat 4 cycles before bed. Studies show it can reduce time to fall asleep by up to 40%.'
        },
        {
            minScore: 0, maxScore: 70,
            type: 'info',
            title: 'Morning Sunlight Exposure',
            text: 'Get 10-15 minutes of natural sunlight within the first hour of waking. This resets your circadian clock by suppressing melatonin and boosting cortisol at the right time, leading to better sleep onset 14-16 hours later.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'Consider Magnesium Supplementation',
            text: 'Magnesium glycinate (200-400mg before bed) has been shown to improve sleep quality in people with low magnesium levels. It regulates GABA receptors and melatonin production. Consult your doctor before starting any supplement.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'info',
            title: 'Start a Sleep Journal',
            text: 'Track your bedtime, wake time, how long it takes to fall asleep, and how you feel each morning. After 2 weeks, patterns will emerge that reveal your biggest sleep disruptors. This is the first step in Cognitive Behavioral Therapy for Insomnia (CBT-I).'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Create a Wind-Down Ritual',
            text: 'Establish a consistent 30-45 minute pre-sleep routine: dim the lights, do light stretching or yoga, and engage in a calming activity like reading. Rituals signal to your brain that sleep is approaching, reducing arousal.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'Evaluate Your Mattress & Pillow',
            text: 'An unsupportive mattress or pillow can reduce sleep quality by up to 20%. If your mattress is over 7-8 years old or you wake with aches, it may be time to replace it. Side sleepers need thicker pillows; back sleepers need thinner ones.'
        },
        {
            minScore: 0, maxScore: 70,
            type: 'info',
            title: 'Limit Naps to 20 Minutes',
            text: 'Long or late-afternoon naps reduce sleep drive (adenosine buildup) and make it harder to fall asleep at night. If you must nap, keep it under 20 minutes and before 2 PM to avoid disrupting your nighttime sleep pressure.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'Seek Professional Help',
            text: 'A consistently low sleep score may indicate an underlying sleep disorder such as insomnia, sleep apnea, or restless leg syndrome. Consider consulting a sleep specialist or asking your doctor about a sleep study for a proper diagnosis.'
        }
    ];

    // Filter supplementary advice by score range, and avoid duplicate titles
    const existingTitles = new Set(advice.map(a => a.title));
    const roundedScore = Math.round(score);
    
    supplementaryAdvice.forEach(tip => {
        if (roundedScore >= tip.minScore && roundedScore <= tip.maxScore && !existingTitles.has(tip.title)) {
            advice.push({
                type: tip.type,
                title: tip.title,
                text: tip.text
            });
            existingTitles.add(tip.title);
        }
    });

    // If no specific advice at all, add a generic positive one
    if (advice.length === 0) {
        advice.push({
            type: 'success',
            title: 'Excellent Routine',
            text: 'Your sleep habits are perfectly optimized. Keep maintaining this consistent, healthy routine!'
        });
    }

    return {
        score: Math.round(score),
        advice,
        duration: enrichedData.durationHours
    };
}

// Make accessible globally
window.analyzeSleepData = analyzeSleepData;
