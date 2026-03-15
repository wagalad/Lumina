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

    // If no specific advice, add a generic positive one
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
