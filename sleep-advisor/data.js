// Sleep Advice Database and Logic

const sleepAdviceDB = [
    {
        id: 'quality_low',
        condition: (data) => data.quality <= 40,
        type: 'warning',
        title: 'Focus on Sleep Environment',
        text: (data) => 'Your reported sleep quality is quite low. Start by optimizing your bedroom: keep it completely dark, quiet, and cool (around 65°F / 18°C).'
    },
    {
        id: 'quality_med',
        condition: (data) => data.quality > 40 && data.quality <= 70,
        type: 'info',
        title: 'Room for Improvement',
        text: (data) => 'Your sleep quality is average. Small adjustments to your evening routine could make a significant difference in how refreshed you feel.'
    },
    {
        id: 'quality_high',
        condition: (data) => data.quality > 70,
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
        id: 'stress_moderate',
        condition: (data) => data.stressLevel >= 4 && data.stressLevel < 7,
        type: 'info',
        title: 'Moderate Stress Quietly Eroding Sleep',
        text: (data) => 'Moderate daily stress raises evening cortisol, delaying your natural melatonin rise. A 10-minute wind-down routine — journaling, stretching, or slow breathing — can lower cortisol enough to measurably improve how quickly you fall asleep.'
    },
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
        id: 'srs_sol_mild',
        condition: (data) => data.sleepLatency > 20 && data.sleepLatency <= 30,
        type: 'info',
        title: 'Slightly Elevated Sleep Onset',
        text: (data) => `Taking ${data.sleepLatency} minutes to fall asleep is above the optimal 10–20 minute range. This often signals mild hyperarousal — your brain is still in "alert" mode. Try dimming all lights 45 minutes before bed and avoiding stimulating content or conversations in that window.`
    },
    {
        id: 'srs_sol',
        condition: (data) => data.sleepLatency > 30,
        type: 'warning',
        title: 'Prolonged Sleep Onset (SRS Actigraphy Data)',
        text: (data) => `Taking ${data.sleepLatency} minutes to fall asleep indicates prolonged Sleep Onset Latency (SOL). Make sure your bedroom is cool, and avoid forcing sleep. If you can't sleep after 20 minutes, get out of bed and do a relaxing activity.`
    },
    {
        id: 'srs_waso_mild',
        condition: (data) => data.waso > 15 && data.waso <= 30,
        type: 'info',
        title: 'Mild Sleep Fragmentation',
        text: (data) => `Being awake ${data.waso} minutes during the night suggests mild fragmentation. Common culprits: ambient noise, light leaks, or a warm bedroom. Avoiding liquids in the 2 hours before bed can also reduce bathroom-related awakenings.`
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
        condition: (data) => data.quality <= 50 && data.durationHours < 7,
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
        condition: (data) => data.quality <= 40 && data.stressLevel >= 7,
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
        condition: (data) => data.quality <= 30,
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
        condition: (data) => data.quality <= 50 && data.stressLevel >= 6 && data.physicalActivity < 30,
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
    },
    // ---- Age-Specific Insights ----
    {
        id: 'age_teen',
        condition: (data) => data.ageGroup === 'teen' && data.durationHours < 8,
        type: 'warning',
        title: 'Teens Need More Sleep',
        text: (data) => `At ${data.durationHours} hours, you're below the 8-10 hours recommended for teenagers. Adolescent brains undergo critical development during sleep — especially memory consolidation, emotional regulation, and growth hormone release. School start times often conflict with teens' naturally delayed circadian rhythm.`
    },
    {
        id: 'age_young_adult',
        condition: (data) => data.ageGroup === 'young_adult' && data.irregularSchedule,
        type: 'info',
        title: 'Young Adult Schedule Disruption',
        text: (data) => 'Young adults (18-25) often have the most irregular schedules due to socializing, shift work, or college life. Your circadian rhythm is still maturing. Anchoring your wake time (even on weekends) is the single most impactful change you can make.'
    },
    {
        id: 'age_senior',
        condition: (data) => data.ageGroup === 'senior',
        type: 'info',
        title: 'Sleep Changes with Age',
        text: (data) => 'After 65, it\'s normal to experience lighter sleep, more awakenings, and earlier wake times. Deep (N3) sleep decreases naturally. Focus on sleep efficiency rather than total hours — 7-8 hours in bed with minimal awakenings is ideal. Regular light exposure during the day helps maintain circadian strength.'
    },
    {
        id: 'age_middle_age',
        condition: (data) => data.ageGroup === 'middle_age' && data.stressLevel >= 6,
        type: 'warning',
        title: 'Midlife Stress & Sleep',
        text: (data) => 'Adults aged 46-64 face a unique combination of career peak stress, family responsibilities, and early hormonal changes that erode sleep quality. Prioritize a non-negotiable wind-down routine and consider cognitive behavioral therapy for insomnia (CBT-I) — it outperforms sleep medication long-term.'
    },
    // ---- Environment Insights ----
    {
        id: 'env_light_leak',
        condition: (data) => data.environment && data.environment.includes('light_leak'),
        type: 'warning',
        title: 'Light Exposure Disrupts Melatonin',
        text: (data) => 'Even small amounts of ambient light suppress melatonin production and fragment sleep cycles. Invest in blackout curtains or a sleep mask. A study in PNAS found that sleeping with dim light (like a TV on) increased insulin resistance and heart rate even during sleep.'
    },
    {
        id: 'env_noisy',
        condition: (data) => data.environment && data.environment.includes('noisy'),
        type: 'warning',
        title: 'Noise Pollution & Sleep Fragmentation',
        text: (data) => 'Environmental noise is one of the top causes of microarousals — brief awakenings you don\'t even remember but that prevent deep sleep. White noise machines or earplugs can reduce noise-related awakenings by up to 38%. Consistent background sounds are far less disruptive than intermittent noise.'
    },
    {
        id: 'env_warm',
        condition: (data) => data.environment && data.environment.includes('warm_room'),
        type: 'warning',
        title: 'Your Room Is Too Warm',
        text: (data) => 'A warm bedroom is one of the most common and fixable sleep disruptors. Your core body temperature needs to drop 1-2°F to initiate sleep. The ideal range is 60-67°F (15-19°C). Try cooling your room, using breathable bed sheets, or taking a warm shower before bed (the post-shower cooling effect helps).'
    },
    {
        id: 'env_optimal',
        condition: (data) => data.environment && data.environment.includes('dark_room') && data.environment.includes('quiet_room') && data.environment.includes('cool_room'),
        type: 'success',
        title: 'Excellent Sleep Environment',
        text: (data) => 'Your bedroom hits all three pillars of an optimal sleep environment: dark, quiet, and cool. This is a major advantage — environment alone can account for a 20-30% difference in sleep quality. Keep it up.'
    },
    // ---- Napping Insights ----
    {
        id: 'nap_long_daily',
        condition: (data) => data.napFrequency === 'daily' && (data.napDuration === 'long' || data.napDuration === 'very_long'),
        type: 'warning',
        title: 'Long Daily Naps Are Hurting Your Night Sleep',
        text: (data) => 'Napping over 45 minutes every day significantly reduces your adenosine sleep pressure — the biological drive that makes you sleepy at night. This leads to longer sleep onset latency and more fragmented nighttime sleep. Limit naps to under 20 minutes, or skip them entirely if you struggle to fall asleep at night.'
    },
    {
        id: 'nap_compensatory',
        condition: (data) => (data.napFrequency === 'sometimes' || data.napFrequency === 'daily') && data.durationHours < 6.5,
        type: 'info',
        title: 'Napping as a Symptom of Sleep Debt',
        text: (data) => `You\'re sleeping ${data.durationHours} hours at night and napping regularly — this suggests accumulated sleep debt. While naps provide partial recovery, they can\'t fully replace the deep sleep and REM cycles that happen during a full night. Address the root cause by extending your night sleep window.`
    },
    // ---- Social Jet Lag Insights ----
    {
        id: 'social_jetlag',
        condition: (data) => data.weekendShift === '2hr' || data.weekendShift === '3hr_plus',
        type: 'warning',
        title: 'Social Jet Lag Detected',
        text: (data) => 'Sleeping 2+ hours later on weekends creates "social jet lag" — a chronic misalignment between your body clock and social schedule. Research published in Current Biology shows this is equivalent to flying across time zones every week. It\'s linked to higher BMI, worse mood, and increased cardiovascular risk. Try limiting weekend sleep-in to 30-60 minutes max.'
    },
    {
        id: 'social_jetlag_bedtime',
        condition: (data) => data.weekendBedtime === '2hr_later' || data.weekendBedtime === '3hr_later',
        type: 'info',
        title: 'Late Weekend Bedtimes Shift Your Clock',
        text: (data) => 'Going to bed 2+ hours later on weekends delays your circadian rhythm, making Monday mornings brutal. This "Sunday night insomnia" effect cascades through the week. A consistent bedtime (within 30-60 minutes) is one of the strongest predictors of good sleep quality across all research datasets.'
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
    // --- Quality Component (max 30 pts) ---
    // Uses a curve so mid-range quality (5-7) still earns decent points
    const qualityNorm = userData.quality / 100; // 0 to 1
    const qualityScore = Math.round(30 * Math.pow(qualityNorm, 0.7));

    // --- Duration Component (max 22 pts) ---
    // Age-adjusted optimal range
    let optimalDuration = 8;
    let durationTolerance = 1; // hours in either direction for full marks
    if (userData.ageGroup === 'teen') {
        optimalDuration = 9; // teens need 8-10h
        durationTolerance = 1;
    } else if (userData.ageGroup === 'young_adult') {
        optimalDuration = 8; // 7-9h
    } else if (userData.ageGroup === 'senior') {
        optimalDuration = 7.5; // 7-8h is fine
        durationTolerance = 0.5;
    }

    const durationDiff = Math.abs(durationHours - optimalDuration);
    let durationScore;
    if (durationDiff <= durationTolerance) {
        durationScore = Math.round(22 * (1 - durationDiff * 0.08));
    } else if (durationDiff <= durationTolerance + 1) {
        durationScore = Math.round(22 * (0.7 - (durationDiff - durationTolerance) * 0.2));
    } else {
        durationScore = Math.max(3, Math.round(22 * Math.max(0, 0.3 - (durationDiff - durationTolerance - 1) * 0.1)));
    }

    // --- Schedule Consistency (max 8 pts) ---
    const scheduleScore = userData.irregularSchedule ? 0 : 8;

    // --- Environment Component (max 10 pts) ---
    // Positive factors add points; this rewards good environment
    let envScore = 0;
    const env = userData.environment || [];
    if (env.includes('dark_room')) envScore += 3;
    if (env.includes('quiet_room')) envScore += 3;
    if (env.includes('cool_room')) envScore += 4;

    // --- Baseline Bonus (12 pts) ---
    const baselineBonus = 12;

    // --- Deductions (capped at 42) ---
    let deductions = 0;

    // Bad habits: 3 pts each
    deductions += userData.habits.length * 3;

    // Stress: graduated scale
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

    // WASO
    if (userData.waso > 45) deductions += 5;
    else if (userData.waso > 30) deductions += 3;
    else if (userData.waso > 15) deductions += 1;

    // Environment negatives
    if (env.includes('light_leak')) deductions += 2;
    if (env.includes('noisy')) deductions += 2;
    if (env.includes('warm_room')) deductions += 2;

    // Napping deductions (long/frequent naps reduce sleep drive)
    const napFreq = userData.napFrequency || 'never';
    const napDur = userData.napDuration || 'short';
    if (napFreq === 'daily' && (napDur === 'long' || napDur === 'very_long')) deductions += 5;
    else if (napFreq === 'daily' && napDur === 'medium') deductions += 3;
    else if (napFreq === 'sometimes' && (napDur === 'long' || napDur === 'very_long')) deductions += 3;
    else if (napFreq === 'daily' && napDur === 'short') deductions += 1;

    // Social jet lag deductions (weekend schedule difference)
    const weekendShift = userData.weekendShift || 'same';
    const weekendBedtime = userData.weekendBedtime || 'same';
    if (weekendShift === '3hr_plus') deductions += 5;
    else if (weekendShift === '2hr') deductions += 3;
    else if (weekendShift === '1hr') deductions += 1;
    if (weekendBedtime === '3hr_later') deductions += 3;
    else if (weekendBedtime === '2hr_later') deductions += 2;

    // Cap total deductions
    deductions = Math.min(deductions, 42);

    let score = qualityScore + durationScore + scheduleScore + envScore + baselineBonus - deductions;

    // Normalize to true 0–100 scale (raw max is 82: 30+22+8+10+12)
    score = Math.round(score * (100 / 82));

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
        },
        // ---- Additional advice for low scorers ----
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'The Two-Week Sleep Reset',
            text: 'For severely disrupted sleep, a structured reset outperforms isolated tips: (1) Set one fixed wake time every day — no exceptions. (2) Only go to bed when genuinely sleepy. (3) If awake in bed >20 min, get up and do something calm until sleepy. (4) No naps. Done consistently for 2 weeks, this rebuilds sleep pressure and resets your drive to sleep.'
        },
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'Audit Your Medications',
            text: 'Many common medications silently disrupt sleep: beta-blockers reduce melatonin, SSRIs suppress REM sleep, decongestants act as stimulants, and corticosteroids elevate cortisol. If you take any prescription or OTC medications regularly, review their sleep side effects with your doctor — a simple timing change can dramatically improve quality.'
        },
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'Consider a Formal Sleep Study',
            text: 'Your sleep profile shows disruption across multiple dimensions. A polysomnography (PSG) sleep study — the gold standard — can detect sleep apnea, periodic limb movement disorder, and REM behavior disorder that self-reported data can\'t catch. Ask your doctor for a referral; many are now available as at-home tests.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'Eliminate Caffeine for 30 Days',
            text: 'If sleep is severely disrupted, a full caffeine elimination (not just cutting back) for 30 days can reveal your true baseline. Many people are surprised how much better they sleep after complete adenosine receptor recovery. Expect withdrawal headaches on days 2–4, then noticeable improvement by week 2.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'info',
            title: 'Try a Body Scan Meditation',
            text: 'Body scan meditation — systematically relaxing each muscle group from toes to head — is one of the most evidence-backed techniques for reducing sleep onset latency. Research shows a 10-minute body scan can be as effective as low-dose sleep medication for chronic insomnia, with no side effects. Free guided sessions are available on Insight Timer.'
        },
        {
            minScore: 0, maxScore: 50,
            type: 'info',
            title: 'The 10-3-2-1-0 Rule',
            text: 'A simple framework that stacks small wins: 10 hours before bed — last caffeine. 3 hours before — last food or alcohol. 2 hours before — stop work. 1 hour before — all screens off. 0 times to hit snooze in the morning. Each step independently improves sleep; together they compound into a significantly faster and deeper night.'
        },
        {
            minScore: 0, maxScore: 50,
            type: 'info',
            title: 'Fix Your Wake Time Before Your Bedtime',
            text: 'Don\'t start by trying to go to bed earlier — that rarely works. Instead, lock in a fixed wake time and hold it for 2 weeks, even on weekends, even if you slept badly. A consistent wake time is the strongest anchor for your circadian rhythm. A natural, earlier bedtime will follow automatically once your sleep pressure builds properly.'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Lower Your Room Temperature Tonight',
            text: 'Your core body temperature must drop 1–2°F to initiate sleep. A cooler bedroom directly accelerates this. The research-backed sweet spot is 65–68°F (18–20°C). If you can only do one thing tonight, this is it — it\'s one of the fastest single-night improvements available to you.'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Get Bright Light in the Morning',
            text: '10–15 minutes of natural sunlight within the first hour of waking suppresses lingering melatonin and triggers a precisely-timed cortisol pulse. This resets your circadian clock so melatonin rises again 14–16 hours later — making it easier to fall asleep at the right time. On cloudy days, a 10,000-lux light therapy lamp achieves the same effect.'
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
