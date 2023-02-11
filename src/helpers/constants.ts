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
const concept = {
  type: 'text',
  width: 53.23,
  height: 7.38,
  fontName: 'metropolis_regular',
  alignment: 'left',
  fontSize: 10,
  characterSpacing: 0,
  lineHeight: 1,
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
      position: { x: 160.37, y: 99.3 },
      ...amount,
    },
    nextInst2: {
      position: { x: 160.37, y: 108.17 },
      ...amount,
    },
    nextInst3: {
      position: { x: 160.37, y: 117.5 },
      ...amount,
    },
    nextInst4: {
      position: { x: 160.37, y: 127.01 },
      ...amount,
    },
    nextInst5: {
      position: { x: 160.37, y: 135.85 },
      ...amount,
    },
    nextInst6: {
      position: { x: 160.37, y: 145.22 },
      ...amount,
    },
    nextInst7: {
      position: { x: 160.37, y: 154.27 },
      ...amount,
    },
    nextInst8: {
      position: { x: 160.37, y: 163.27 },
      ...amount,
    },
    nextInst9: {
      position: { x: 160.37, y: 173.01 },
      ...amount,
    },
    nextInst10: {
      position: { x: 160.58, y: 182.22 },
      ...amount,
    },
    nextInst11: {
      position: { x: 160.26, y: 191.43 },
      ...amount,
    },
    nextInst12: {
      position: { x: 160.47, y: 201.17 },
      ...amount,
    },
    prevInst1: {
      position: { x: 119.57, y: 99.3 },
      ...amount,
    },
    prevInst2: {
      position: { x: 119.57, y: 108.17 },
      ...amount,
    },
    prevInst3: {
      position: { x: 119.57, y: 117.5 },
      ...amount,
    },
    prevInst4: {
      position: { x: 119.57, y: 127.01 },
      ...amount,
    },
    prevInst5: {
      position: { x: 119.57, y: 135.85 },
      ...amount,
    },
    prevInst6: {
      position: { x: 119.57, y: 145.22 },
      ...amount,
    },
    prevInst7: {
      position: { x: 119.57, y: 154.27 },
      ...amount,
    },
    prevInst8: {
      position: { x: 119.57, y: 163.27 },
      ...amount,
    },
    prevInst9: {
      position: { x: 119.57, y: 173.01 },
      ...amount,
    },
    prevInst10: {
      position: { x: 119.78, y: 182.22 },
      ...amount,
    },
    prevInst11: {
      position: { x: 119.46, y: 191.43 },
      ...amount,
    },
    prevInst12: {
      position: { x: 119.67, y: 201.17 },
      ...amount,
    },
    concept1: {
      position: { x: 63.69, y: 99.3 },
      ...concept,
    },
    concept2: {
      position: { x: 63.69, y: 108.17 },
      ...concept,
    },
    concept3: {
      position: { x: 63.69, y: 117.5 },
      ...concept,
    },
    concept4: {
      position: { x: 63.69, y: 127.01 },
      ...concept,
    },
    concept5: {
      position: { x: 63.69, y: 135.85 },
      ...concept,
    },
    concept6: {
      position: { x: 63.69, y: 145.22 },
      ...concept,
    },
    concept7: {
      position: { x: 63.69, y: 154.27 },
      ...concept,
    },
    concept8: {
      position: { x: 63.69, y: 163.27 },
      ...concept,
    },
    concept9: {
      position: { x: 63.69, y: 173.01 },
      ...concept,
    },
    concept10: {
      position: { x: 63.9, y: 182.22 },
      ...concept,
    },
    concept11: {
      position: { x: 63.58, y: 191.43 },
      ...concept,
    },
    concept12: {
      position: { x: 63.79, y: 201.17 },
      ...concept,
    },
    loanAmount: {
      position: { x: 105.3, y: 51 },
      ...titleAmount,
    },
    pastDue: {
      position: { x: 105.3, y: 56 },
      ...titleAmount,
    },
    totalInArreas: {
      position: { x: 105.3, y: 61 },
      fontColor: '#ed1c34',
      ...titleAmount,
    },
    interest: {
      position: { x: 105.3, y: 66.7 },
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
