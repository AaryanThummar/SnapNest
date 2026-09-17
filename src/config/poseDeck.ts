// photobooth app/src/config/poseDeck.ts
// Diverse deck of 36 unique, high-energy, fun pose challenges for Pose Battle

export interface PoseChallengeItem {
  id: string;
  title: string;
  desc: string;
  category: 'ACTION' | 'FASHION' | 'COMEDY' | 'DANCE' | 'SUPERHERO' | 'ICONIC';
  emoji: string;
  tip: string;
}

export const POSE_DECK: PoseChallengeItem[] = [
  // ACTION & SUPERHERO
  {
    id: 'superhero_landing',
    title: 'SUPERHERO LANDING',
    desc: 'Drop down with one fist on the ground and look up with intense hero gaze.',
    category: 'SUPERHERO',
    emoji: '💥',
    tip: 'One knee down, fist firmly planted, fierce eyes forward!'
  },
  {
    id: 'disco_fever',
    title: 'DISCO FEVER',
    desc: 'Point one finger diagonally straight to the sky with 70s Saturday Night swagger.',
    category: 'DANCE',
    emoji: '🕺',
    tip: 'One hand high, opposite hand on hip, dynamic tilt!'
  },
  {
    id: 'martial_arts_crane',
    title: 'MARTIAL ARTS CRANE',
    desc: 'Balance gracefully on one leg with arms spread wide like a kung-fu master.',
    category: 'ACTION',
    emoji: '🥋',
    tip: 'Knee raised high, wing arms arched with sharp precision.'
  },
  {
    id: 'secret_agent',
    title: 'SECRET AGENT',
    desc: 'Form double finger guns and aim stealthily around an imaginary corner.',
    category: 'ACTION',
    emoji: '🕵️',
    tip: 'Elbows locked, sideways glance, 007 intensity.'
  },
  {
    id: 'air_guitar_hero',
    title: 'AIR GUITAR HERO',
    desc: 'Shred a wild imaginary electric guitar solo like a stadium rockstar.',
    category: 'DANCE',
    emoji: '🎸',
    tip: 'Strumming arm high, open-mouth rockstar scream!'
  },
  {
    id: 'olympic_sprinter',
    title: 'OLYMPIC SPRINTER',
    desc: 'Freeze in an explosive set-ready runner launch stance at the finish line.',
    category: 'ACTION',
    emoji: '🏃',
    tip: 'Lean forward with clenched fists and determination!'
  },
  {
    id: 'bodybuilder_flex',
    title: 'CHAMPION BODYBUILDER',
    desc: 'Hit a massive double bicep flex with full muscular grit and game face.',
    category: 'ACTION',
    emoji: '💪',
    tip: 'Elbows parallel to shoulders, flex everything you have!'
  },
  {
    id: 'ninja_strike',
    title: 'NINJA STRIKE',
    desc: 'Low stealth crouch with one hand guarding face and other ready to strike.',
    category: 'ACTION',
    emoji: '🥷',
    tip: 'Deep stance, sharp eye contact, razor focus.'
  },

  // FASHION & EDITORIAL
  {
    id: 'vogue_framing',
    title: 'VOGUE HIGH-FASHION',
    desc: 'Frame your face with sharp, angular hands like a luxury runway cover.',
    category: 'FASHION',
    emoji: '💎',
    tip: 'Geometric wrist angles, effortless haute couture gaze.'
  },
  {
    id: 'over_the_shoulder',
    title: 'OVER THE SHOULDER',
    desc: 'Turn your body away and gaze back over your shoulder with smoldering drama.',
    category: 'FASHION',
    emoji: '✨',
    tip: 'Chin lifted slightly, eyes locked onto the lens.'
  },
  {
    id: 'the_thinker',
    title: 'THE THINKER',
    desc: 'Rest your chin deeply on your closed fist in profound philosophical contemplation.',
    category: 'ICONIC',
    emoji: '🤔',
    tip: 'Elbow resting on knee or arm, deep contemplative brow.'
  },
  {
    id: 'red_carpet_shades',
    title: 'RED CARPET PAPARAZZI',
    desc: 'Lower your sunglasses with one finger and flash a dazzling Hollywood smirk.',
    category: 'FASHION',
    emoji: '🕶️',
    tip: 'Head tilted back, supreme A-list confidence.'
  },
  {
    id: 'royal_crown_adjust',
    title: 'ROYALTY CROWN ADJUST',
    desc: 'Delicately adjust an invisible sparkling crown on your head with royal dignity.',
    category: 'FASHION',
    emoji: '👑',
    tip: 'Fingertips atop head, regal posture, elevated chin.'
  },
  {
    id: 'heart_hands',
    title: 'K-POP HEART HANDS',
    desc: 'Form a clean symmetrical heart using both hands over your chest with a radiant smile.',
    category: 'FASHION',
    emoji: '🫶',
    tip: 'Thumbs touching below, fingers curved neatly above.'
  },

  // COMEDY & WILD
  {
    id: 'chaotic_gremlin',
    title: 'CHAOTIC GREMLIN',
    desc: 'Unleash full wild goblin energy with claw hands and wide eccentric eyes!',
    category: 'COMEDY',
    emoji: '👹',
    tip: 'Exaggerate your expressions to the absolute max!'
  },
  {
    id: 'trapped_in_box',
    title: 'MIME IN A GLASS BOX',
    desc: 'Place your flat palms against an invisible glass wall with confused wonder.',
    category: 'COMEDY',
    emoji: '📦',
    tip: 'Flat hands, straight wrists, looking through the glass!'
  },
  {
    id: 'shocked_astronaut',
    title: 'ZERO-G ASTRONAUT',
    desc: 'Float with wide-open mouth, hands clutching cheeks in total planetary shock!',
    category: 'COMEDY',
    emoji: '🚀',
    tip: 'Eyes wide, hands on cheeks like Home Alone in space.'
  },
  {
    id: 't_rex_roar',
    title: 'T-REX ROAR',
    desc: 'Tuck wrists against your chest as tiny dinosaur arms and unleash a silent roar!',
    category: 'COMEDY',
    emoji: '🦖',
    tip: 'Short bent arms, wide open fierce roar face!'
  },
  {
    id: 'dramatic_opera',
    title: 'DRAMATIC OPERA CLIMAX',
    desc: 'Clutch one hand to your heart and reach the other to the stars singing the final note!',
    category: 'COMEDY',
    emoji: '🎭',
    tip: 'Theatrical chest out, chin raised high to the heavens.'
  },
  {
    id: 'zen_tree',
    title: 'ZEN MASTER',
    desc: 'Bring palms together at center chest in tranquil, centered equilibrium.',
    category: 'ICONIC',
    emoji: '🧘',
    tip: 'Calm breathing, serene smile, hands in prayer namaste.'
  },
  {
    id: 'matrix_dodge',
    title: 'MATRIX BULLET DODGE',
    desc: 'Lean backward dramatically from the knees as if dodging imaginary laser beams!',
    category: 'ACTION',
    emoji: '🕶️',
    tip: 'Torso angled back, arms balancing the kinetic wave!'
  },
  {
    id: 'pirate_lookout',
    title: 'PIRATE CAPTAIN LOOKOUT',
    desc: 'Hold one hand over your brow scanning the far horizon for treasure!',
    category: 'ICONIC',
    emoji: '🏴‍☠️',
    tip: 'Hand saluting brow, confident sea captain stance.'
  }
];

/**
 * Returns N unique, random challenges from the deck, ensuring no two players get the same pose.
 */
export function drawUniquePlayerChallenges(playerCount: number, excludeIds: string[] = []): PoseChallengeItem[] {
  const available = POSE_DECK.filter(p => !excludeIds.includes(p.id));
  const pool = available.length >= playerCount ? available : POSE_DECK;
  
  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, playerCount);
}
