import { combineReducers } from 'redux';
import authReducers from './auth';
import cooperationTermReducers from './cooperationTerm';
import corporateReducers from './corporate';
import corporateTrx from './corporateTrx/corporatetrx';
import housecallReducers from './housecall';
import labPartnerReducers from './labPartner';
import labTransactionReducers from './labtransaction';
import productReducers from './product';
import roleReducers from './role';
import sidebarReducers from './sidebar';
import tierReducers from './tier';
import transactionReducers from './transaction';
import errorReducers from './error';
import siteReducers from './site';
import labResultReducer from './labResult';

export default combineReducers({
  auth: authReducers,
  sidebar: sidebarReducers,
  role: roleReducers,
  labpartner: labPartnerReducers,
  cooperationterm: cooperationTermReducers,
  labtransaction: labTransactionReducers,
  corporate: corporateReducers,
  product: productReducers,
  tier: tierReducers,
  site: siteReducers,
  corporateTrx: corporateTrx,
  houseCall: housecallReducers,
  transaction: transactionReducers,
  errorRedux: errorReducers,
  labResult: labResultReducer,
});
