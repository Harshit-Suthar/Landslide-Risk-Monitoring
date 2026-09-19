// Service for AI Model Predictions (Shell / Mock data for Phase 1)

export const predictionService = {
  getModelInfo() {
    return {
      version: 'v0.1 — Risk Scoring',
      lastTrained: 'September 16, 2026',
      accuracy: 89.4,
      f1Score: 0.88,
      algorithm: 'Gradient Boosting (XGBoost) + Sentinel-1 SAR Features',
      trainingSamples: '14,820 historical slope points across 8 NER states',
    };
  },

  getFeatureInputs() {
    return [
      { name: 'Cumulative 72h Rainfall', value: '148.5 mm', threshold: '> 120 mm indicates saturation' },
      { name: 'Volumetric Soil Moisture', value: '78.2 %', threshold: '> 70% high pore-water pressure' },
      { name: 'Slope Angle (DEM)', value: '38.4°', threshold: '> 30° critical gravitational shear' },
      { name: 'Historical Incident Count', value: '4 events', threshold: 'Past 10-year GSI catalog' },
    ];
  },

  getPredictions() {
    return [
      {
        id: 'pred-1',
        location: 'Durtlang Hills Sector 4, Aizawl',
        predictedRisk: 'Critical',
        confidence: 94.2,
        predictedDate: 'Next 12 Hours',
        triggerFactor: 'Heavy precipitation exceeding antecedent threshold',
      },
      {
        id: 'pred-2',
        location: 'Nongthymmai Ridge, Shillong',
        predictedRisk: 'Critical',
        confidence: 91.8,
        predictedDate: 'Next 24 Hours',
        triggerFactor: 'Sub-surface saturation with 41° slope angle',
      },
      {
        id: 'pred-3',
        location: 'NH-29 Kohima By-Pass Corridor',
        predictedRisk: 'High',
        confidence: 86.5,
        predictedDate: 'Next 24 Hours',
        triggerFactor: 'Ongoing toe-cutting and highway vibration',
      },
      {
        id: 'pred-4',
        location: 'Tathangchen Ward, Gangtok',
        predictedRisk: 'High',
        confidence: 82.0,
        predictedDate: 'Next 48 Hours',
        triggerFactor: 'Unchannelized municipal drainage seepage',
      },
      {
        id: 'pred-5',
        location: 'Banderdewa Slope, Itanagar',
        predictedRisk: 'Medium',
        confidence: 76.4,
        predictedDate: 'Next 72 Hours',
        triggerFactor: 'Moderate rainfall forecast',
      },
      {
        id: 'pred-6',
        location: 'Kangchup Foothills, Imphal',
        predictedRisk: 'Medium',
        confidence: 73.1,
        predictedDate: 'Next 72 Hours',
        triggerFactor: 'Stream bank scouring',
      },
    ];
  },

  async triggerPrediction() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      status: 'success',
      message: 'Prediction inference job dispatched to high-performance inference cluster.',
      timestamp: new Date().toISOString(),
    };
  }
};

export default predictionService;
