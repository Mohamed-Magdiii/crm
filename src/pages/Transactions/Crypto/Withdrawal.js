import React, {
  useState, useEffect
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import TableLoader from "components/Common/Loader";
import CustomPagination from "components/Common/CustomPagination";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import WithDrawForm from "./WithDrawForm";
import { 
  fetchWithdrawalsStart, withdrawApproveStart, withdrawRejectStart
} from "store/transactions/withdrawal/action";
import SearchBar from "components/Common/SearchBar";
import CustomDropdown from "components/Common/CustomDropDown";
import Notification from "components/Common/Notification";
import logo from "../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link } from "react-router-dom";
import DetailsModal from "./DetailsModal";
import { captilazeFirstLetter } from "common/utils/manipulateString";
function Withdrawal(props){
  const dispatch = useDispatch();
  const [, setSearchInput] = useState("");
  const [sizePerPage, setSizePerPage] = useState(10);
  const [showNotication, setShowNotifaction] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selected, setSelected] = useState("LIVE");
  const [btnprimary1, setBtnprimary1] = useState(false);

  useEffect(()=>{
    loadWithdrawals(1, sizePerPage);
  }, [sizePerPage, 1, selected, props.withdrawResponseMessage]);
  
  const handleSearchInput = (e)=>{
  
    setSearchInput(e.target.value);
    
  };
  const columns = [
    {
      dataField:"checkbox",
      text: <input type="checkbox" id = "check-all-withdrawals" onChange={()=>checkAllBoxes("check-all-withdrawals", ".withdraw-checkbox")}/>
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => {
        let d = new Date(val.createdAt);
        d = d.getDate()  + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
        d.getHours() + ":" + d.getMinutes();
        return d;
      }
    }, 
    {
      dataField:"customerId",
      text:props.t("Client"),
      formatter:(val)=>{
        return (
          <div>
            <Link 
              to = {{
                pathname :val.customerId ? `/clients/${val.customerId._id}/profile` : "",
                state : { clientId : val.customerId ? val.customerId._id : "" }
              }}
            
            >
              <i className="no-italics"> {val.customerId ? `${captilazeFirstLetter(val.customerId.firstName)} ${captilazeFirstLetter(val.customerId.lastName)}` : ""}</i>
            </Link>
          </div>
        );
       
       
      }
    },
    {
      dataField:"gateway",
      text:props.t("Gateway")
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
    
    },
    {
      dataField: "status",
      text: props.t("Status"),
    },
    {
      dataField: "reason",
      text:"Reason",
      formatter:(val)=>val.reason ? <div data-title ={val.reason} >
        {val.reason.length > 20 ? `${val.reason.slice(0, 20)}...` : val.reason}
      </div> : ""
    },

    {
      dataField:"amount",
      text:props.t("Amount"),
      formatter: (val) => (val?.amount?.$numberDecimal || val?.amount || ""),
    },
    {
      dataField: "dropdown",
      text:props.t("Action")
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Details"),
      formatter: (val) => (
        <div className="text-center">
          <Link className={`${val.gateway === "BLOCKCHAIN" ? "text-success" : "text-muted"}`} to="#">
            <i
              className="mdi mdi-eye font-size-20"
              id="edittooltip"
              onClick={() => {
                if (val.gateway === "BLOCKCHAIN"){
                  setDetailsModal(true);
                  setSelectedContent(val.rawData);
                }
                
              }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];
  const loadWithdrawals = (page, limit)=>{
    dispatch(fetchWithdrawalsStart({
      page,
      limit,
      type:selected
    }));
  };
  const withdrawApprove = (withdraw)=>{
    dispatch(withdrawApproveStart({
      id:withdraw._id,
      customerId:withdraw.customerId._id 
    }));
    setShowNotifaction(true);
  };
  const withdrawReject = (withdraw)=>{
    dispatch(withdrawRejectStart({
      id:withdraw._id,
      customerId:withdraw.customerId._id 
    }));
    setShowNotifaction(true);
  };
  const closeNotifaction = () => {
    setShowNotifaction(false);
  };
  return (

    <React.Fragment>
      <Notification onClose={closeNotifaction}
        body={props.t("The update of the withdraw has been made successfully")}
        show={showNotication}
        header={props.t("Withdraw update")}
        time={props.t("Now")}
        logo={logo}/>
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle>{props.t(`Withdrawals(${props.totalDocs})`)}</CardTitle>
                <WithDrawForm />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <SearchBar handleSearchInput={handleSearchInput} placeholder={props.t("Search for withdrawals")}/>
                <div>
                  <Dropdown
                    isOpen={btnprimary1}
                    toggle={() => setBtnprimary1(!btnprimary1)}
                  >
                    <DropdownToggle tag="button" className="btn btn-primary">
                      {selected} <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem value="LIVE" onClick={(e)=>{setSelected(e.target.value)}}>LIVE</DropdownItem>
                      <DropdownItem value="DEMO" onClick={(e)=>{setSelected(e.target.value)}}>DEMO</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </CardHeader>
      
            <CardBody>
              <div className="table-rep-plugin">
                <div
                  className="table-responsive mb-0"
                  data-pattern="priority-columns"
                >
                  <Table
                    id="tech-companies-1"
                    className="table  table-hover "
                  >
                    <Thead className="text-center table-light" >
                      <Tr>
                        {columns.map((column, index) =>
                          <Th data-priority={index} key={index}>{column.text}</Th>
                        )}
                      </Tr>
                    </Thead>
                    {
                      props.totalDocs === 0
                        ?
                        <Tbody>
                          {props.loading && <TableLoader colSpan={4} />}                            
                          {!props.loading &&
                            <>
                              <Tr>
                                <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                  <h3 className="fw-bolder text-center">No records</h3>
                                </Td>
                              </Tr>
                            </>
                          }
                        </Tbody>
                        :
                        <Tbody  style={{ fontSize : "13px" }} className="text-center">
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.withdrawals.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className = "pt-4">
                                  { column.dataField === "checkbox" ? <input className= "withdraw-checkbox"  type="checkbox"/> : ""}
                                  { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                  {column.dataField === "dropdown" ? <CustomDropdown permission={props.withdrawalsPermissions.actions ? true : false} id={row._id} status={row.status} approve={()=>{withdrawApprove(row)}} reject={()=>{withdrawReject(row)}} /> : ""}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                    }
                  </Table>
                  <CustomPagination
                    {...props}
                    setSizePerPage={setSizePerPage}
                    sizePerPage={sizePerPage}
                    onChange={loadWithdrawals}
                    docs={props.withdrawals}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <DetailsModal open= {detailsModal} rawData={selectedContent} onClose={()=>setDetailsModal(false)}/>
    </React.Fragment>
    
  );
}
const mapStateToProps = (state)=>({
  loading:state.withdrawalReducer.loading || false,
  withdrawals:state.withdrawalReducer.withdrawals || [],
  page: state.withdrawalReducer.page || 1,
  totalDocs: state.withdrawalReducer.totalDocs || 0,
  totalPages: state.withdrawalReducer.totalPages || 0,
  hasNextPage: state.withdrawalReducer.hasNextPage,
  hasPrevPage: state.withdrawalReducer.hasPrevPage,
  limit: state.withdrawalReducer.limit,
  nextPage: state.withdrawalReducer.nextPage,
  pagingCounter: state.withdrawalReducer.pagingCounter,
  prevPage: state.withdrawalReducer.prevPage,
  withdrawalsPermissions: state.Profile.withdrawalsPermissions || {},
  withdrawResponseMessage:state.withdrawalReducer.withdrawResponseMessage
}
);
export default connect(mapStateToProps, null)(withTranslation()(Withdrawal));