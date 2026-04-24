// Sleep Advice Database and Logic

const sleepAdviceDB = [
    // ---- Quality (Kaggle Sleep Health & Lifestyle Dataset) ----
    {
        id: 'quality_low',
        condition: (data) => data.quality <= 40,
        type: 'warning',
        title: 'Low Self-Reported Quality Predicts Worse Outcomes (Kaggle Dataset)',
        text: (data) => 'The Kaggle Sleep Health and Lifestyle dataset shows a strong, direct correlation between low self-reported sleep quality and measurably shorter sleep duration, elevated daily stress scores, and increased rates of sleep disorders. Low quality ratings are not just subjective — they track with objective markers of sleep disruption.'
    },
    {
        id: 'quality_med',
        condition: (data) => data.quality > 40 && data.quality <= 70,
        type: 'info',
        title: 'Average Quality Responds to Behavioral Adjustment (Kaggle Dataset)',
        text: (data) => 'In the Kaggle Sleep Health and Lifestyle dataset, participants in the mid-range quality tier showed the most meaningful score improvements after correcting for schedule consistency and stress levels — both of which are controllable. Average is the most changeable tier.'
    },
    {
        id: 'quality_high',
        condition: (data) => data.quality > 70,
        type: 'success',
        title: 'High Quality Correlates with Exercise and Consistency (Kaggle Dataset)',
        text: (data) => 'The Kaggle dataset found that high self-reported sleep quality scores clustered strongly around three factors: regular physical activity (30+ min/day), consistent sleep schedules, and low daily stress. Your current habits align with the dataset\'s highest-performing profiles.'
    },
    // ---- Duration (NSF / SHHS) ----
    {
        id: 'duration_short',
        condition: (data) => data.durationHours < 7,
        type: 'warning',
        title: 'Duration Below Safe Threshold (NSF / SHHS)',
        text: (data) => `At ${data.durationHours} hours, you're below the 7-hour minimum the National Sleep Foundation identifies as necessary for adult health. The Sleep Heart Health Study (SHHS, n=6,441) found that sleeping under 7 hours is independently associated with elevated risk of coronary heart disease, stroke, and hypertension — regardless of other lifestyle factors.`
    },
    // ---- Schedule (NSF) ----
    {
        id: 'irregular_schedule',
        condition: (data) => data.irregularSchedule,
        type: 'warning',
        title: 'Irregular Schedule Disrupts Circadian Rhythm (NSF)',
        text: (data) => 'The National Sleep Foundation identifies circadian misalignment as a primary driver of sleep disorders. Your body clock is set daily by the timing of light exposure — without a consistent wake time, this anchor is lost. NSF data shows irregular schedules are associated with increased sleep onset difficulty, more nighttime awakenings, and reduced restorative sleep stages.'
    },
    // ---- Habits (NSF / SleepFM) ----
    {
        id: 'habit_screens',
        condition: (data) => data.habits.includes('screens'),
        type: 'warning',
        title: 'Screen Light Suppresses Melatonin by Up to 50% (NSF)',
        text: (data) => 'National Sleep Foundation research documents that blue light from screens suppresses melatonin production by up to 50%, directly delaying sleep onset. 94% of Americans use caffeinated beverages and screens in the evening — the NSF identifies this combination as the most widespread driver of self-reported sleep quality decline.'
    },
    {
        id: 'habit_caffeine',
        condition: (data) => data.habits.includes('caffeineLate'),
        type: 'warning',
        title: 'Caffeine Blocks Adenosine Sleep Pressure (NSF)',
        text: (data) => 'The National Sleep Foundation documents caffeine\'s half-life of 4–6 hours and its mechanism: it blocks adenosine receptors, preventing the buildup of the sleep pressure signal your brain needs to feel sleepy. Afternoon caffeine can still be partially active in your system at midnight, raising the floor on how alert your brain stays during sleep.'
    },
    {
        id: 'habit_alcohol',
        condition: (data) => data.habits.includes('alcohol'),
        type: 'warning',
        title: 'Alcohol Reduces Sleep Quality by 39% and Suppresses REM (NSF / SleepFM)',
        text: (data) => 'NSF data shows alcohol decreases overall sleep quality by up to 39%. SleepFM\'s analysis of 585,000+ hours of sleep recordings confirmed that alcohol specifically suppresses REM sleep — a stage whose reduction is independently associated with all-cause mortality. The REM deficit concentrates in the second half of the night, fragmenting the sleep cycles you need most.'
    },
    {
        id: 'habit_heavyMeal',
        condition: (data) => data.habits.includes('heavyMeal'),
        type: 'warning',
        title: 'Eating Within 2 Hours of Bed Linked to Sleep Disruption (NSF)',
        text: (data) => 'National Sleep Foundation research links eating within 2 hours of bedtime to delayed sleep onset, difficulty staying asleep, and increased obesity risk. Late meals shift blood flow and hormonal activity toward digestion at precisely the time your body should be preparing for sleep.'
    },
    {
        id: 'habit_workoutLate',
        condition: (data) => data.habits.includes('workoutLate'),
        type: 'warning',
        title: 'Late Intense Exercise Delays Core Temperature Drop (NSF)',
        text: (data) => 'The National Sleep Foundation identifies elevated core body temperature from late intense exercise as a direct sleep disruptor. Initiating sleep requires your core temperature to drop by 1–2°F — a process intense exercise delays by up to 4 hours. The NSF recommends finishing high-intensity workouts at least 3 hours before bed.'
    },
    // ---- Stress (Kaggle Dataset) ----
    {
        id: 'stress_moderate',
        condition: (data) => data.stressLevel >= 4 && data.stressLevel < 7,
        type: 'info',
        title: 'Moderate Stress Measurably Reduces Sleep Duration (Kaggle Dataset)',
        text: (data) => 'The Kaggle Sleep Health and Lifestyle dataset shows a clear dose-response relationship between daily stress and sleep metrics. Even moderate stress (4–6/10) is associated with meaningfully shorter sleep durations and lower quality scores compared to low-stress peers — and stress was found to have a stronger predictive effect on sleep than BMI or physical activity alone.'
    },
    {
        id: 'kaggle_stress',
        condition: (data) => data.stressLevel >= 7,
        type: 'warning',
        title: 'High Stress Is the Strongest Predictor of Poor Sleep (Kaggle Dataset)',
        text: (data) => 'In the Kaggle Sleep Health and Lifestyle dataset, high daily stress (7+/10) emerged as the single strongest predictor of poor sleep quality scores — outweighing BMI, age, and physical activity. High-stress participants consistently showed reduced sleep duration, lower quality ratings, and higher rates of sleep disorders across the dataset.'
    },
    // ---- Physical Activity (Kaggle Dataset) ----
    {
        id: 'kaggle_activity',
        condition: (data) => data.physicalActivity < 30,
        type: 'info',
        title: 'Less Than 30 Min/Day Activity Linked to Lower Sleep Scores (Kaggle Dataset)',
        text: (data) => 'Kaggle Sleep Health dataset analysis found that people exercising less than 30 minutes per day consistently score lower on sleep quality indexes. The dataset identified physical activity as one of the three most influential modifiable factors for sleep quality, alongside stress and schedule consistency.'
    },
    // ---- BMI (Kaggle / NSRR) ----
    {
        id: 'kaggle_bmi',
        condition: (data) => data.bmiCategory === 'Obese' || data.bmiCategory === 'Overweight',
        type: 'warning',
        title: 'Elevated BMI Strongly Linked to Sleep Disorders (Kaggle / NSRR/SHHS)',
        text: (data) => `The Kaggle Sleep Health dataset and NSRR/SHHS data (n=6,441) both identify elevated BMI as a primary independent risk factor for Obstructive Sleep Apnea and sleep-disordered breathing. The SHHS found that higher BMI correlated with significantly increased nighttime awakenings, reduced sleep efficiency, and greater cardiovascular risk from sleep disruption.`
    },
    // ---- Sleep Onset (SRS Actigraphy Data) ----
    {
        id: 'srs_sol_mild',
        condition: (data) => data.sleepLatency > 20 && data.sleepLatency <= 30,
        type: 'info',
        title: 'Sleep Onset 20–30 Min Signals Mild Hyperarousal (SRS Actigraphy)',
        text: (data) => `Sleep Research Society actigraphy studies define the optimal Sleep Onset Latency (SOL) as 10–20 minutes. At ${data.sleepLatency} minutes, your nervous system is taking longer than the research benchmark to downshift from alertness to sleep — a pattern SRS data links to mild chronic hyperarousal, often driven by evening light exposure or stimulating pre-bed activity.`
    },
    {
        id: 'srs_sol',
        condition: (data) => data.sleepLatency > 30,
        type: 'warning',
        title: 'Prolonged Sleep Onset Latency — Clinical Threshold Exceeded (SRS)',
        text: (data) => `Taking ${data.sleepLatency} minutes to fall asleep exceeds the Sleep Research Society's clinical threshold for prolonged SOL. SRS actigraphy research identifies SOL > 30 minutes as a primary diagnostic marker for insomnia disorder, associated with reduced N3 deep sleep, lower overall efficiency, and elevated next-day stress hormones.`
    },
    // ---- WASO (SRS / ISRUC-Sleep) ----
    {
        id: 'srs_waso_mild',
        condition: (data) => data.waso > 15 && data.waso <= 30,
        type: 'info',
        title: 'Nighttime Wakefulness Reduces Sleep Efficiency (SRS / ISRUC-Sleep)',
        text: (data) => `SRS actigraphy data and ISRUC-Sleep PSG recordings show that even 15–30 minutes of Wake After Sleep Onset (WASO) measurably reduces time in restorative N3 and REM stages. At ${data.waso} minutes of nighttime wakefulness, your sleep architecture is being disrupted in ways that compound over consecutive nights.`
    },
    {
        id: 'srs_waso',
        condition: (data) => data.waso > 30,
        type: 'warning',
        title: 'Significant Fragmentation — WASO Exceeds Clinical Threshold (SRS)',
        text: (data) => `At ${data.waso} minutes of nighttime wakefulness, your Wake After Sleep Onset exceeds the Sleep Research Society's clinical fragmentation threshold. SRS actigraphy datasets link WASO at this level to substantially reduced N3 deep sleep and REM, lower sleep efficiency scores, and impaired next-day cognitive function.`
    },
    // ---- NSRR / SHHS ----
    {
        id: 'nsrr_cardiovascular',
        condition: (data) => data.quality <= 50 && data.durationHours < 7,
        type: 'warning',
        title: 'Cardiovascular Risk Elevated by Short + Poor Sleep (NSRR/SHHS)',
        text: (data) => 'The Sleep Heart Health Study (SHHS, n=6,441) found that the combination of short sleep duration and low sleep quality is strongly associated with coronary heart disease, stroke, and hypertension — independent of other risk factors. NSRR data confirms this pattern holds across diverse populations. Reaching 7+ hours of quality sleep is identified as a direct cardiovascular protective measure.'
    },
    {
        id: 'nsrr_sdb',
        condition: (data) => data.waso > 20 && (data.bmiCategory === 'Obese' || data.bmiCategory === 'Overweight'),
        type: 'warning',
        title: 'Sleep-Disordered Breathing Risk Profile (NSRR/SHHS/MrOS)',
        text: (data) => 'NSRR data from the SHHS and MrOS Sleep Study (5,994 men, 65+) shows that frequent nighttime awakenings combined with elevated BMI significantly predict sleep-disordered breathing (SDB). The MrOS study found SDB in this profile is linked to increased fracture risk and all-cause mortality. A home sleep test or clinical sleep study can confirm or rule this out.'
    },
    // ---- HSP / BDSP ----
    {
        id: 'hsp_neuro',
        condition: (data) => data.quality <= 40 && data.stressLevel >= 7,
        type: 'warning',
        title: 'Accelerated Brain Aging Risk (Human Sleep Project / BDSP)',
        text: (data) => 'Research from the Human Sleep Project (26,200+ PSG studies, Massachusetts General Hospital) found that chronic poor sleep quality combined with high stress is associated with accelerated EEG-derived "brain age" and elevated risk of cerebrovascular disease and Alzheimer\'s. The HSP identified this combination as one of the highest-risk sleep profiles in its dataset.'
    },
    {
        id: 'hsp_brain_age',
        condition: (data) => data.durationHours < 6,
        type: 'warning',
        title: 'Under 6 Hours Accelerates Biological Brain Aging (HSP/BDSP)',
        text: (data) => `At ${data.durationHours} hours, you are consistently below the level where the Human Sleep Project's data shows brain aging acceleration. HSP researchers at Mass General found that EEG-based "brain age" — a predictor of life expectancy — is significantly elevated in people who chronically sleep under 6 hours. Even a 30-minute increase in nightly sleep duration produced measurable improvements.`
    },
    // ---- SleepFM / Nature Medicine ----
    {
        id: 'sleepfm_disease',
        condition: (data) => data.quality <= 30,
        type: 'warning',
        title: 'Very Poor Sleep Quality Is a Clinical Signal (SleepFM, Nature Medicine 2026)',
        text: (data) => 'A 2026 study in Nature Medicine trained the SleepFM model on 585,000+ hours of sleep data and found that a single night of sleep can predict 130+ future health conditions — including dementia (C-Index 0.85), heart failure (0.80), and chronic kidney disease (0.79). At this quality level, sleep is not just uncomfortable — it is a measurable health signal worth discussing with a physician.'
    },
    {
        id: 'sleepfm_rem',
        condition: (data) => data.durationHours < 7 && data.habits.includes('alcohol'),
        type: 'warning',
        title: 'REM Suppression + Short Sleep Linked to Mortality (SleepFM)',
        text: (data) => 'SleepFM analysis of 585,000+ hours of recordings found that low REM sleep, high arousal burden, and low sleep efficiency are each independently associated with higher all-cause mortality. Alcohol directly suppresses REM sleep, and short duration further compresses the second half of the night where most REM occurs — making this combination clinically significant.'
    },
    // ---- SleepFounder ----
    {
        id: 'sleepfounder_apnea',
        condition: (data) => data.bmiCategory === 'Obese' && data.waso > 15,
        type: 'warning',
        title: 'High-Risk Profile for Undiagnosed Sleep Apnea (SleepFounder)',
        text: (data) => 'The SleepFounder model (medRxiv 2025), built on 780,000+ hours of multi-ethnic sleep data, identifies obese BMI combined with frequent nighttime awakenings as the highest-risk profile for undiagnosed obstructive sleep apnea. The study found ~85 million Americans have OSA with ~80% undiagnosed. A home sleep test is now widely available and covered by most insurance.'
    },
    {
        id: 'sleepfounder_cardio',
        condition: (data) => data.quality <= 50 && data.stressLevel >= 6 && data.physicalActivity < 30,
        type: 'warning',
        title: 'Cardiorespiratory Disease Risk Cluster (SleepFounder)',
        text: (data) => 'The SleepFounder model showed that cardiorespiratory signals during sleep predict heart failure (AUROC 0.88), high cholesterol (0.83), GERD (0.89), and coronary heart disease (0.81). Your combination of low sleep quality, elevated stress, and low physical activity matches the dataset\'s elevated-risk cluster. Improving physical activity has the strongest single-factor impact in this profile.'
    },
    // ---- ISRUC-Sleep ----
    {
        id: 'isruc_architecture',
        condition: (data) => data.waso > 20 && data.sleepLatency > 20,
        type: 'warning',
        title: 'Combined Latency + Fragmentation Disrupts Deep and REM Sleep (ISRUC)',
        text: (data) => 'PSG recordings from the ISRUC-Sleep dataset (University of Coimbra), scored by two independent clinical experts, show that elevated sleep latency combined with frequent awakenings produces compounding disruption to N3 (deep sleep) and REM stages. ISRUC data confirms that people with this pattern spend significantly less time in the restorative sleep stages than those with either problem alone.'
    },
    // ---- Age-Specific (NSF / MrOS) ----
    {
        id: 'age_teen',
        condition: (data) => data.ageGroup === 'teen' && data.durationHours < 8,
        type: 'warning',
        title: 'Adolescents Require 8–10 Hours for Brain Development (NSF)',
        text: (data) => `At ${data.durationHours} hours, you're below the NSF's recommended 8–10 hours for teenagers. The National Sleep Foundation identifies adolescence as the highest-need sleep period for brain development — specifically memory consolidation, emotional regulation, and growth hormone release, all of which are concentrated in the extended REM and deep sleep cycles teenagers require.`
    },
    {
        id: 'age_young_adult',
        condition: (data) => data.ageGroup === 'young_adult' && data.irregularSchedule,
        type: 'info',
        title: 'Irregular Schedules Hit Young Adults Hardest (NSF)',
        text: (data) => 'The National Sleep Foundation identifies young adults (18–25) as the age group most susceptible to circadian disruption from irregular schedules, due to a naturally delayed circadian phase combined with social and work demands. NSF data shows anchoring wake time — even when going to bed late — is the most effective single intervention for this group.'
    },
    {
        id: 'age_senior',
        condition: (data) => data.ageGroup === 'senior',
        type: 'info',
        title: 'Normal Sleep Architecture Changes After 65 (MrOS / NSF)',
        text: (data) => 'The MrOS Sleep Study (5,994 men, 65+) and NSF both document that lighter sleep, more frequent awakenings, and earlier wake times are normal age-related changes. The MrOS study found that optimizing sleep efficiency — rather than chasing total hours — was the strongest predictor of health outcomes in this age group. Consistent daytime light exposure helps maintain circadian strength.'
    },
    {
        id: 'age_middle_age',
        condition: (data) => data.ageGroup === 'middle_age' && data.stressLevel >= 6,
        type: 'warning',
        title: 'Midlife Stress Compounds Hormonal Sleep Disruption (Kaggle / NSF)',
        text: (data) => 'The Kaggle Sleep Health dataset found adults 46–64 with stress ≥ 6/10 showed the steepest sleep quality decline of any age-stress combination in the dataset — a pattern the NSF attributes to career-peak stress intersecting with hormonal changes that independently reduce deep sleep. CBT-I (Cognitive Behavioral Therapy for Insomnia) is the NSF\'s top-rated intervention for this profile, outperforming sleep medication in long-term outcomes.'
    },
    // ---- Environment (NSF / PNAS) ----
    {
        id: 'env_light_leak',
        condition: (data) => data.environment && data.environment.includes('light_leak'),
        type: 'warning',
        title: 'Ambient Light Increases Insulin Resistance and Heart Rate During Sleep (NSF / PNAS)',
        text: (data) => 'National Sleep Foundation guidelines cite a PNAS study finding that sleeping with even dim ambient light (equivalent to a TV in standby) increased heart rate and insulin resistance measurably during sleep — even when participants were unconscious and unaware of the light. Blackout curtains or a sleep mask eliminate this effect entirely.'
    },
    {
        id: 'env_noisy',
        condition: (data) => data.environment && data.environment.includes('noisy'),
        type: 'warning',
        title: 'Environmental Noise Causes Microarousals That Fragment Sleep (NSF)',
        text: (data) => 'The National Sleep Foundation identifies environmental noise as a top cause of microarousals — brief brain activations that prevent deep sleep without fully waking you. NSF data shows white noise or earplugs reduce noise-related awakenings by up to 38%, and that consistent background sound is far less disruptive than intermittent noise of the same volume.'
    },
    {
        id: 'env_warm',
        condition: (data) => data.environment && data.environment.includes('warm_room'),
        type: 'warning',
        title: 'Room Temperature Above 68°F Impairs Sleep Onset (NSF)',
        text: (data) => 'The National Sleep Foundation identifies room temperature as one of the most impactful and underutilized sleep variables. Initiating sleep requires a core body temperature drop of 1–2°F — a warm room directly opposes this. NSF research puts the optimal range at 60–67°F (15–19°C), with meaningful sleep quality improvements documented within the first night of correction.'
    },
    {
        id: 'env_optimal',
        condition: (data) => data.environment && data.environment.includes('dark_room') && data.environment.includes('quiet_room') && data.environment.includes('cool_room'),
        type: 'success',
        title: 'Ideal Sleep Environment Achieved (NSF)',
        text: (data) => 'Your bedroom meets all three pillars the National Sleep Foundation identifies as most impactful for sleep quality: darkness (melatonin preservation), quiet (microarousal prevention), and cool temperature (core body temperature drop facilitation). NSF data shows environment alone accounts for a 20–30% difference in sleep quality scores across populations.'
    },
    // ---- Napping (NSF) ----
    {
        id: 'nap_long_daily',
        condition: (data) => data.napFrequency === 'daily' && (data.napDuration === 'long' || data.napDuration === 'very_long'),
        type: 'warning',
        title: 'Long Daily Naps Deplete Adenosine Sleep Pressure (NSF)',
        text: (data) => 'The National Sleep Foundation documents that napping over 45 minutes daily significantly depletes adenosine — the chemical that accumulates throughout the day and creates the biological drive to sleep at night. NSF data shows this pattern directly extends sleep onset latency and increases nighttime fragmentation, creating a cycle of poor nighttime sleep driving more daytime napping.'
    },
    {
        id: 'nap_compensatory',
        condition: (data) => (data.napFrequency === 'sometimes' || data.napFrequency === 'daily') && data.durationHours < 6.5,
        type: 'info',
        title: 'Regular Napping on Short Sleep Indicates Accumulated Debt (NSF)',
        text: (data) => `Sleeping ${data.durationHours} hours at night while napping regularly is a pattern the National Sleep Foundation identifies as compensatory sleep debt behavior. NSF research shows naps provide partial cognitive recovery but cannot replicate the deep N3 and REM sleep stages that only occur in sustained nighttime sleep — meaning the underlying deficit compounds over time.`
    },
    // ---- Social Jet Lag (Current Biology / NSF) ----
    {
        id: 'social_jetlag',
        condition: (data) => data.weekendShift === '2hr' || data.weekendShift === '3hr_plus',
        type: 'warning',
        title: 'Social Jet Lag — Equivalent to Weekly Cross-Timezone Travel (Current Biology)',
        text: (data) => 'Research published in Current Biology found that sleeping 2+ hours later on weekends creates "social jet lag" — a chronic circadian misalignment equivalent to flying across multiple time zones every week. The study linked this pattern to higher BMI, worse mood, increased cardiovascular risk, and impaired metabolic function, with effects compounding across the work week.'
    },
    {
        id: 'social_jetlag_bedtime',
        condition: (data) => data.weekendBedtime === '2hr_later' || data.weekendBedtime === '3hr_later',
        type: 'info',
        title: 'Late Weekend Bedtimes Phase-Delay Your Circadian Clock (NSF)',
        text: (data) => 'The National Sleep Foundation identifies late weekend bedtimes as a driver of "Sunday night insomnia" — a phase-delayed circadian rhythm that makes it harder to fall asleep Sunday and wake Monday. NSF data across multiple studies shows bedtime consistency within 30–60 minutes is one of the strongest predictors of overall sleep quality and daytime alertness.'
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

    // 5. Score-tiered supplementary advice — all grounded in cited datasets
    const supplementaryAdvice = [
        // ---- Score ≤ 30 (severe) ----
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'PSG Sleep Study Indicated by SleepFM & SleepFounder Data',
            text: 'SleepFM (Nature Medicine 2026) and SleepFounder (medRxiv 2025) both highlight that self-reported sleep data at this severity level correlates strongly with undetected disorders — sleep apnea, REM behavior disorder, and periodic limb movement disorder — that only polysomnography (PSG) can confirm. Home PSG tests are now widely available and covered by most insurance. A clinical referral is the highest-leverage action at this score.'
        },
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'Stimulus Control Therapy — Top CBT-I Protocol (SRS Research)',
            text: 'Sleep Research Society data identifies stimulus control therapy as the most effective single component of CBT-I for severe insomnia. The protocol: (1) use the bed only for sleep, (2) leave the bed if awake for more than 20 minutes, (3) return only when sleepy, (4) maintain a fixed wake time regardless of the previous night. SRS actigraphy studies show measurable improvements in SOL and WASO within two weeks.'
        },
        {
            minScore: 0, maxScore: 30,
            type: 'warning',
            title: 'Low REM and Efficiency Independently Predict Mortality (SleepFM)',
            text: 'SleepFM\'s analysis of 585,000+ hours of sleep data found that low REM sleep, high arousal burden, and low sleep efficiency each independently predict higher all-cause mortality — and their effects compound when co-occurring. A score at this level reflects all three being compromised simultaneously. Addressing even one of these factors produces measurable improvements in the others.'
        },
        // ---- Score ≤ 40 ----
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'Sleep Restriction Therapy Rebuilds Adenosine Drive (SRS)',
            text: 'Sleep Research Society clinical data supports sleep restriction therapy as highly effective for low-efficiency sleep profiles: limit time in bed to your actual sleep duration, then extend by 15 minutes per week as efficiency improves above 85%. This rebuilds adenosine sleep pressure, reduces the hyperarousal that fragments sleep, and restores normal sleep architecture within 3–4 weeks.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'warning',
            title: 'SHHS: Short + Poor Sleep Compounds Cardiovascular Risk Over Time',
            text: 'The Sleep Heart Health Study (n=6,441) found that sustained short, poor-quality sleep creates cumulative cardiovascular strain — not just acute risk. Participants who improved sleep duration and quality showed measurable reductions in blood pressure and inflammatory markers over follow-up periods. The SHHS data makes clear that this is a modifiable risk factor, not a fixed one.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'info',
            title: 'Sleep Diary Is the First Step in CBT-I — The Gold Standard Treatment (SRS)',
            text: 'Sleep Research Society protocols for CBT-I — the most evidence-backed insomnia treatment, outperforming medication in long-term outcomes — begin with a two-week sleep diary. Tracking bedtime, wake time, estimated SOL, WASO, and morning alertness reveals the patterns driving your specific profile. Without this data, interventions are less targeted and less effective.'
        },
        {
            minScore: 0, maxScore: 40,
            type: 'info',
            title: 'Physical Activity Is a Top-3 Modifiable Sleep Factor (Kaggle Dataset)',
            text: 'The Kaggle Sleep Health and Lifestyle dataset identified physical activity as one of the three most influential modifiable factors for sleep quality — alongside stress and schedule consistency. Participants who increased from <30 to 30+ minutes of daily activity showed improvements in both sleep quality scores and duration that rivalled pharmacological interventions, with no side effects.'
        },
        // ---- Score ≤ 50 ----
        {
            minScore: 0, maxScore: 50,
            type: 'info',
            title: 'Consistent Wake Time Is the Strongest Circadian Anchor (NSF)',
            text: 'The National Sleep Foundation identifies a fixed daily wake time as the single most impactful behavioral intervention for circadian rhythm stabilization. NSF data shows that anchoring wake time — even when going to bed late or sleeping poorly — produces measurable improvements in sleep onset, sleep efficiency, and daytime alertness within 5–7 days, as adenosine pressure rebuilds on a predictable schedule.'
        },
        {
            minScore: 0, maxScore: 50,
            type: 'info',
            title: 'Caffeine Elimination Reveals True Sleep Baseline (NSF)',
            text: 'The National Sleep Foundation documents that chronic caffeine use masks the true severity of sleep disruption by pharmacologically overriding adenosine-based sleepiness signals. A 30-day complete elimination — not reduction — allows full adenosine receptor recovery and reveals baseline sleep quality. NSF data shows most people significantly underestimate their sleep deficit until caffeine is removed entirely.'
        },
        // ---- Score ≤ 55 ----
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Morning Light Resets Circadian Phase 14–16 Hours Forward (NSF)',
            text: 'The National Sleep Foundation identifies morning light exposure as the primary mechanism for daily circadian clock resetting. 10–15 minutes of bright natural light within the first hour of waking suppresses residual melatonin and triggers a timed cortisol pulse, setting the circadian phase so melatonin rises again at the correct time that evening. On overcast days, a 10,000-lux therapy lamp produces the same effect.'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Pre-Sleep Arousal Reduction Is Core to NSF Sleep Hygiene Protocol',
            text: 'The National Sleep Foundation\'s evidence-based sleep hygiene protocol centers on reducing physiological and cognitive arousal in the 45–60 minutes before bed: dim all lights (melatonin preservation), avoid emotionally stimulating content, and engage in a consistent low-arousal activity. NSF data shows a reliable pre-sleep routine produces measurable reductions in sleep onset latency within one week.'
        },
        {
            minScore: 0, maxScore: 55,
            type: 'info',
            title: 'Room Temperature Drop Accelerates Sleep Onset (NSF)',
            text: 'The National Sleep Foundation identifies room temperature as one of the fastest single-night interventions for sleep quality. Lowering bedroom temperature to 65–68°F (18–20°C) directly accelerates the core body temperature drop required for sleep initiation, reducing sleep onset latency measurably on the first night. NSF research found this single change outperformed most behavioral interventions in speed of effect.'
        },
        // ---- Score ≤ 70 ----
        {
            minScore: 0, maxScore: 70,
            type: 'info',
            title: 'Naps Over 20 Min or After 3 PM Reduce Nighttime Sleep Drive (NSF)',
            text: 'The National Sleep Foundation documents that naps exceeding 20 minutes or taken after 3 PM reduce the adenosine buildup that drives nighttime sleep onset. NSF guidelines recommend power naps (10–20 min, before 3 PM) as the only nap pattern that provides cognitive recovery without measurably disrupting nighttime sleep pressure.'
        },
        {
            minScore: 0, maxScore: 70,
            type: 'info',
            title: '1 in 3 Adults Are Sleep-Deprived — and Most Underestimate It (NSF)',
            text: 'The National Sleep Foundation reports that 1 in 3 American adults fail to get the recommended 7+ hours nightly. Crucially, NSF and SHHS data both show that chronically sleep-deprived individuals significantly underestimate their own impairment — the brain adapts to a lower baseline and perceives it as normal. If you feel like you function fine on less sleep, the data suggests otherwise.'
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
