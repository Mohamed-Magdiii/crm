import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
  Label,
} from "reactstrap";

import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { makeWithdrawalStart } from "store/transactions/withdrawal/action";
import { fetchGatewaysOfWithdrawalsStart } from "store/gateway/action";
import { fetchWalletStart, clearWallets } from "store/wallet/action";
import { fetchClientsStart } from "store/client/actions";
import { withTranslation } from "react-i18next";
import Select from "react-select";
// import AvFieldSelect from "components/Common/AvFieldSelect";

function WithdrawForm(props){

  const [open, setWithdrawalModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [gateway, setGateway] = useState("");
  const [type, setType] = useState("LIVE");

  const dispatch = useDispatch();
  const { create } = props.withdrawalsPermissions;
  const handleWithdraw = (event, values) => {
    event.preventDefault();
    dispatch(makeWithdrawalStart({
      customerId:selectedClient,
      walletId: selectedWalletId,
      // gateway,
      ...values
    }));
    setSearchInput("");
    dispatch(clearWallets());
    
  }; 
  const selectClient = (id)=>{
    setSelectedClient(id);
    dispatch(fetchWalletStart({
      belongsTo:id,
      customerId:id,
    }));
  };
  const selectType = (type)=>{
    setType(type);
    if (selectedClient.length > 0)
      dispatch(fetchWalletStart({
        belongsTo:selectedClient,
        customerId:selectedClient,
      }));
  };
  const toggleAddModal = () => {
    setWithdrawalModal(!open);
  };

  useEffect(()=>{
    dispatch(fetchClientsStart({
      limit:props.totalDocs,
      type
    }));
    dispatch(fetchGatewaysOfWithdrawalsStart());
    if (searchInput.length >= 3){
      dispatch(fetchClientsStart({
        searchText:searchInput,
        limit:props.totalDocs,
        type
      }));
    }
  }, [searchInput, type, open]);

  useEffect(() => {
    if (props.withdrawalModalClear && open){
      setWithdrawalModal(false);
    }
  }, [props.withdrawalModalClear]);
  
  
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> {props.t("Make Withdraw")}</Link>
      <Modal isOpen={open} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Make Withdraw")}
        </ModalHeader>
        <ModalBody >

          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleWithdraw(e, v);
            }}
          >
            
            <Row className="mb-3">
              <Col md="6">
                <Label>{props.t("Client")}</Label>
                <div>
                  <Select 
                    onChange={(e) => { 
                      selectClient(e.value.id);
                    }}
                    isSearchable = {true}
                    options={props.loading ? [] : props.clients.map((item) => (
                      {
                        label : `${item.firstName} ${item.lastName}`,
                        value : {
                          name: `${item.firstName} ${item.lastName}`,
                          id: `${item._id}`
                        }
                      }

                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = "choose client name"
                    onInputChange = {(e)=>setSearchInput(e)}
                    name = "clientId"
                    isRequired = {true}
                    isLoading={props.loading}
                  />
                </div>
              
              </Col>
              <Col md="6">
                <Label>{props.t("Type")}</Label>
                
                
                <div>
                  <Select 
                    defaultValue={{
                      label:"Live",
                      value:"LIVE" 
                    }}
                    onChange={(e) => {
                      selectType(e.value);   
                    }}
                    options={[{
                      label:"Live",
                      value:"LIVE" 
                    },
                    {
                      label:"Demo",
                      value:"DEMO"
                    }]}
                    classNamePrefix="select2-selection"
                    placeholder = "choose a type for deposit"
                  />
                </div>
              </Col>
              <Col md="12">
                <Label>{props.t("Wallet")}</Label>
                <div>
                  <Select 
                    onChange={(e) => {
                    
                      setSelectedWalletId(e.value.id);
                    
                    }}
                    isSearchable = {true}
                    options={props.wallets.map((wallet) => (
                      {
                        label : `${wallet.asset} ${wallet.amount} ${wallet.asset}`,
                        value : {
                          id: `${wallet._id}`
                        }
                      }

                    ))}
                    classNamePrefix="select2-selection"
                    placeholder = "choose your wallet"

                  />
                </div>
              
              </Col>
      
            </Row>  
            <div className="mb-3">
              <Label>{props.t("Gateway")}</Label>
              <div>
                {/* <AvFieldSelect
                  name="gateway"
                  type="text"
                  value={Object.keys(props.gateways)[0]?.gateway}
                  errorMessage={props.t("Choose gateway")}
                  validate={{ required: { value: true } }}
                  label={props.t("Gateway")}
                  options={Object.keys(props.gateways).map((key) => (
                    {
                      label : `${props.gateways[key]}`,
                      value : `${props.gateways[key]}`
                    }
                  ))}
                /> */}
                <Select 
                  onChange={(e) => {
                    setGateway(e.value.gateway);
                  }}
                  isSearchable = {true}
                  options={Object.keys(props.gateways).map((key) => (
                    {
                      label : `${props.gateways[key]}`,
                      value : {
                        gateway : `${props.gateways[key]}`
                      }
                    }
                  ))}
                  classNamePrefix="select2-selection"
                  placeholder = "Choose a gateway"
                />
                <AvField
                  name="gateway"
                  type="text"
                  errorMessage={props.t("Choose a gateway")}
                  validate={{ required: { value: true } }}
                  value={gateway}
                  style={{
                    opacity: 0,
                    height: 0,
                    width: 0,
                    margin: -10
                  }}
                />
              </div>
            </div>
            
               
            <div className="mb-3">
              <AvField
                name="amount"
                label={props.t("Amount")}
                placeholder={props.t("enter amount")}
                type="number"
                min="0"
                errorMessage={props.t("Enter Valid Amount")}
                validate = {{
                  required :{ value:true }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="note"
                label={props.t("Note")}
                placeholder={props.t("enter note")}
                type="text"
                errorMessage={props.t("Enter Valid Note")}
                validate={{ required: { value: true } }}
              />
            </div>
    
            <div className='text-center pt-3 p-2'>
              <Button disabled = {props.disableWithdrawalButton} type="submit" color="primary" className="">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}

        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  gateways:state.gatewayReducer.gateways || [],
  error: state.withdrawalReducer.error,
  withdrawResponseMessage:state.withdrawalReducer.withdrawResponseMessage,
  withdrawalModalClear:state.withdrawalReducer.withdrawalModalClear,
  clients:state.clientReducer.clients || [],
  wallets:state.walletReducer.wallets || [],
  withdrawalsPermissions: state.Profile.withdrawalsPermissions || {}, 
  disableWithdrawalButton : state.withdrawalReducer.disableWithdrawalButton,
  totalDocs:state.clientReducer.totalDocs,
  loading:state.clientReducer.loading
});
export default connect(mapStateToProps, null)(withTranslation()(WithdrawForm));