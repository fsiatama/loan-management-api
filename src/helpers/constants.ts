const titleAmount = {
  type: 'text',
  width: 31.56,
  height: 4.35,
  fontName: 'metropolis_medium',
  alignment: 'right',
  fontSize: 10,
  characterSpacing: 0,
  lineHeight: 1,
};
const amount = {
  type: 'text',
  width: 39.48,
  height: 7.38,
  alignment: 'right',
  fontSize: 10,
  characterSpacing: 0,
  lineHeight: 1,
};
const amountRed = {
  type: 'text',
  width: 39.48,
  height: 7.38,
  alignment: 'right',
  fontSize: 10,
  characterSpacing: 0,
  lineHeight: 1,
  fontColor: '#ed1c34',
};
const concept = {
  type: 'text',
  width: 53.23,
  height: 7.38,
  fontName: 'metropolis_medium',
  alignment: 'left',
  fontSize: 9,
  characterSpacing: 0,
  lineHeight: 1,
  fontColor: '#242b3a',
};
const conceptRed = {
  type: 'text',
  width: 53.23,
  height: 7.38,
  fontName: 'metropolis_medium',
  alignment: 'left',
  fontSize: 9,
  characterSpacing: 0,
  lineHeight: 1,
  fontColor: '#ed1c34',
};

const subtitle = {
  width: 48.23,
  height: 4.61,
  fontName: 'metropolis_thin',
  alignment: 'left',
  fontSize: 9,
  characterSpacing: 0,
  lineHeight: 1,
  fontColor: '#ffffff',
};

export const STATEMENT_PDF_SCHEMAS = [
  {
    borrowers: {
      type: 'text',
      position: { x: 11.12, y: 203.73 },
      width: 48.23,
      height: 4.61,
      fontName: 'metropolis_medium',
      alignment: 'left',
      fontSize: 12,
      characterSpacing: 0,
      lineHeight: 1,
      fontColor: '#ffffff',
    },
    borrowersStreet: {
      type: 'text',
      position: {
        x: 11.12,
        y: 209.69,
      },
      ...subtitle,
    },
    borrowersCity: {
      type: 'text',
      position: {
        x: 11.12,
        y: 215.66,
      },
      ...subtitle,
    },
    borrowersPhone: {
      type: 'text',
      position: {
        x: 11.12,
        y: 221.62,
      },
      width: 48.23,
      height: 4.61,
      alignment: 'left',
      fontSize: 10,
      characterSpacing: 0,
      lineHeight: 1,
      fontColor: '#ffffff',
    },
    nextInst1: {
      position: { x: 159.3, y: 101 },
      ...amount,
    },
    nextInst2: {
      position: { x: 159.3, y: 109.6 },
      ...amount,
    },
    nextInst3: {
      position: { x: 159.3, y: 119 },
      ...amount,
    },
    nextInst4: {
      position: { x: 159.3, y: 128.6 },
      ...amount,
    },
    nextInst5: {
      position: { x: 159.3, y: 137.6 },
      ...amount,
    },
    nextInst6: {
      position: { x: 159.3, y: 146.82 },
      ...amount,
    },
    nextInst7: {
      position: { x: 159.3, y: 156.04 },
      ...amount,
    },
    nextInst8: {
      position: { x: 159.3, y: 165.26 },
      ...amount,
    },
    nextInst9: {
      position: { x: 159.3, y: 174.48 },
      ...amount,
    },
    nextInst10: {
      position: { x: 159.3, y: 183.7 },
      ...amount,
    },
    nextInst11: {
      position: { x: 159.3, y: 192.92 },
      ...amount,
    },
    nextInst12: {
      position: { x: 159.3, y: 202.14 },
      ...amount,
    },
    nextInst13: {
      position: { x: 159.3, y: 211.36 },
      ...amount,
    },
    prevInst1: {
      position: { x: 119.57, y: 101 },
      ...amount,
    },
    prevInst2: {
      position: { x: 119.57, y: 109.6 },
      ...amount,
    },
    prevInst3: {
      position: { x: 119.57, y: 119 },
      ...amount,
    },
    prevInst4: {
      position: { x: 119.57, y: 128.6 },
      ...amount,
    },
    prevInst5: {
      position: { x: 119.57, y: 137.6 },
      ...amount,
    },
    prevInst5red: {
      position: { x: 119.57, y: 137.6 },
      ...amountRed,
    },
    prevInst6: {
      position: { x: 119.57, y: 146.82 },
      ...amount,
    },
    prevInst7: {
      position: { x: 119.57, y: 156.04 },
      ...amount,
    },
    prevInst8: {
      position: { x: 119.57, y: 165.26 },
      ...amount,
    },
    prevInst9: {
      position: { x: 119.57, y: 174.48 },
      ...amount,
    },
    prevInst10: {
      position: { x: 119.57, y: 183.7 },
      ...amount,
    },
    prevInst11: {
      position: { x: 119.57, y: 192.92 },
      ...amount,
    },
    prevInst12: {
      position: { x: 119.57, y: 202.14 },
      ...amount,
    },
    prevInst13: {
      position: { x: 119.57, y: 211.36 },
      ...amount,
    },
    concept1: {
      position: { x: 63.69, y: 101 },
      ...concept,
    },
    concept2: {
      position: { x: 63.69, y: 109.6 },
      ...concept,
    },
    concept3: {
      position: { x: 63.69, y: 119 },
      ...concept,
    },
    concept4: {
      position: { x: 63.69, y: 128.6 },
      ...concept,
    },
    concept5: {
      position: { x: 63.69, y: 137.6 },
      ...concept,
    },
    concept5red: {
      position: { x: 63.69, y: 137.6 },
      ...conceptRed,
    },
    concept6: {
      position: { x: 63.69, y: 146.82 },
      ...concept,
    },
    concept7: {
      position: { x: 63.69, y: 156.04 },
      ...concept,
    },
    concept8: {
      position: { x: 63.69, y: 165.26 },
      ...concept,
    },
    concept9: {
      position: { x: 63.69, y: 174.48 },
      ...concept,
    },
    concept10: {
      position: { x: 63.69, y: 183.7 },
      ...concept,
    },
    concept11: {
      position: { x: 63.69, y: 192.92 },
      ...concept,
    },
    concept12: {
      position: { x: 63.69, y: 202.14 },
      ...concept,
    },
    concept13: {
      position: { x: 63.69, y: 211.36 },
      ...concept,
    },
    loanAmount: {
      position: { x: 99, y: 51 },
      ...titleAmount,
    },
    pastDue: {
      position: { x: 99, y: 56 },
      ...titleAmount,
    },
    totalInArreas: {
      position: { x: 99, y: 61 },
      fontColor: '#ed1c34',
      ...titleAmount,
    },
    interest: {
      position: { x: 99, y: 66.7 },
      ...titleAmount,
    },
    installments: {
      position: { x: 176.42, y: 56.26 },
      type: 'text',
      width: 23.36,
      height: 4.35,
      fontName: 'metropolis_medium',
      alignment: 'center',
      fontSize: 10,
      characterSpacing: 0,
      lineHeight: 1,
    },
    nextPaymentDate: {
      type: 'text',
      position: { x: 176.42, y: 61.49 },
      width: 23.36,
      height: 4.35,
      fontName: 'metropolis_medium',
      alignment: 'center',
      fontSize: 10,
      characterSpacing: 0,
      lineHeight: 1,
    },
    lastPaymentDate: {
      type: 'text',
      position: { x: 176.42, y: 67 },
      width: 23.36,
      height: 4.35,
      fontName: 'metropolis_medium',
      alignment: 'center',
      fontSize: 10,
      characterSpacing: 0,
      lineHeight: 1,
    },
    statementDate: {
      type: 'text',
      position: { x: 84.67, y: 41.54 },
      width: 51.14,
      height: 7,
      fontName: 'metropolis_medium',
      alignment: 'left',
      fontSize: 14,
      characterSpacing: 0,
      lineHeight: 1,
      fontColor: '#27282e',
    },
  },
];
