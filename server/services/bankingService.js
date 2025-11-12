const bankingRepository = require('../repositories/bankingRepository');
const PosError=require('../utils/posError')

const bankingService = {
  getAllBanking: async (search, limit, offset) => {
   const bankings= await bankingRepository.findAllBanking(search, limit, offset);
   if(bankings.length===0)
   {
    throw new PosError('Banking details not found',404)
   }
   return bankings;
  },

  getBankingById: async (id) => {
    const banking= await bankingRepository.findBankingById(id);
    if(!banking)
    {
      throw new PosError('Banking details not found',404)
    }
    return banking;
  },

  createBanking: async (bankingData) => {
    const { type, amount, description, reference, performedBy } = bankingData;
    
    return await bankingRepository.createBanking({
      type,
      amount,
      description,
      reference,
      performedBy
    });
  },

  updateBanking: async (id, bankingData) => {
    const { type, amount, description, reference } = bankingData;
    
    const updated = await bankingRepository.updateBanking(id, {
      type,
      amount,
      description,
      reference
    });

    return !!updated;
  },

  deleteBanking: async (id) => {
    const deleted = await bankingRepository.deleteBanking(id);
    return !!deleted;
  },

  getTotalBankingCount: async (search = null) => {
    return await bankingRepository.countBanking(search);
  },

  getBankingSummary: async (startDate = null, endDate = null) => {
    return await bankingRepository.getBankingSummary(startDate, endDate);
  }
};

module.exports = bankingService;