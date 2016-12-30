var env = require('../../environment.js');

exports.login = {
  adminLogin: {
    'userName': env.adminUserName,
    'password': env.adminPassword,
    'lastName': 'Page',
    'firstName': 'Laurel'
    
  },
  nurseLogin: {
    'userName': 'zeadmin',
    'password': 'Jiva@123'
  },
  providerLogin: {
    'userName': 'zeadmin',
    'password': 'Jiva@123'
  },
  providerPortalLogin: {
    'userName': 'selzeoprovider',
    'password': 'Jiva@123',
    'lastName': 'selprvLname',
    'firstName': 'selprvFname'
  },
  userLogin: {
    'userName': 'usertest',
    'password': 'Zeo@999'
  },

   mdLogin: {
    'userName': 'mdlogin',
    'password': 'Jiva@123'
  },

  sentinelLogin: {
    'userName': 'zeadmin',
    'password': 'Jiva@123'
  },
  mobileAppLogin: {
    'userName': 'zeadmin',
    'password': 'Jiva@247'
  },
  clientPortalLogin: {
    'userName': 'zeclient',
    'password': 'Jiva@123'
  },
  memberPortalLogin: {
      'password': 'Jiva@123'
  },
  reinsurancePortalLogin : {
    'userName':'reinPortalUser',
    'password':'Jiva@123'
  }
};
