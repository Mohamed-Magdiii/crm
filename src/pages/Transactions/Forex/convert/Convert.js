import React, {
  useState, useEffect
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
// import CustomDropdown from "components/Common/CustomDropDown";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import AddConvertModal from "./AddConvertModal";
import { fetchConverts } from "store/converts/actions";

function Convert(props){
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const columns = [
    {
      dataField:"checkbox",
      text: <input type="checkbox" id = "check-all-deposits" onChange = {()=>checkAllBoxes("check-all-deposits", ".deposit-checkbox")}/>
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => {
        let d = new Date(val.createdAt);
        d = d.getDate()  + "-" + (d.getMonth() +  1) + "-" + d.getFullYear() + " " +
          d.getHours() + ":" + d.getMinutes();
        return d;
      }
    },
    {
      dataField: "fromAsset",
      text: props.t("From Asset")
    },
    {
      dataField: "toAsset",
      text: props.t("To Asset")
    },
    {
      dataField: "fromAmount",
      text: props.t("From Amount")
    },
    {
      dataField: "toAmount",
      text: props.t("To Amount")
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter:(item) => {
        return (
          item.status === "APPROVED" 
            ?
            <div>
              <spam className="no-italics text-success">{item.status}</spam>
            </div>
            :
            item.status === "PENDING"
              ?
              <div>
                <spam className="no-italics text-warning">{item.status}</spam>
              </div>
              :
              <div>
                <spam className="no-italics text-danger">{item.status}</spam>
              </div>
        );
      }
    }
  ];
  
  const handleSearchInput = (e)=>{
    setSearchInput(e.target.value); 
  };
  
  const loadConverts = ()=>{
    dispatch(fetchConverts());   
  };
  
  const closeNotifaction = () => {
    setShowNotifaction(false);
  };
  
  useEffect(()=>{
    loadConverts(1, sizePerPage);
  }, [sizePerPage, 1, searchInput, selectedFilter]);
  
  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("Convert has been updated successfully")}
        show={showNotication}
        header={props.t("Convert Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                    
                <CardTitle>{props.t(`Converts(${props.totalDocs})`)}</CardTitle>
                <AddConvertModal />
              </div>
                  
              <div className="d-flex justify-content-between align-items-center">
                <SearchBar handleSearchInput={handleSearchInput} placeholder={props.t("Search For Convert")}/>
                <div>
                  <Dropdown
                    isOpen={btnprimary1}
                    toggle={() => setBtnprimary1(!btnprimary1)}
                  >
                    <DropdownToggle tag="button" className="btn btn-primary">
                      {selectedFilter} <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem value="ALL" onClick={(e)=>{setSelectedFilter(e.target.value)}}>All</DropdownItem>
                      <DropdownItem value="APPROVED" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Approved</DropdownItem>
                      <DropdownItem value="REJECTED" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Rejected</DropdownItem>
                      <DropdownItem value="PENDING" onClick={(e)=>{setSelectedFilter(e.target.value)}}>Pending</DropdownItem>
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
                        <Tbody className="text-center" style={{ fontSize : "13px" }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.converts.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className= "pt-4">
                                  { column.dataField === "checkbox" ? <input className = "deposit-checkbox" type="checkbox"/> : ""}
                                  { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                  {/* {column.dataField === "dropdown" ? <CustomDropdown  permission={props.depositsPermissions.actions ? true : false}
                                      id={row._id} status={row.status} approve={()=>{depositApprove(row)}} reject={()=>{depositReject(row)}} /> : ""} */}
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
                    onChange={loadConverts}
                    docs={props.converts}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
    
const mapStateToProps = (state) => ({
  loading: state.convertReducer.fetchLoading || false,
  converts: state.convertReducer.converts || [],
  page: state.convertReducer.page || 1,
  totalDocs: state.convertReducer.convertsTotalDocs || 0,
  totalPages: state.convertReducer.totalPages || 0,
  hasNextPage: state.convertReducer.hasNextPage,
  hasPrevPage: state.convertReducer.hasPrevPage,
  limit: state.convertReducer.limit,
  nextPage: state.convertReducer.nextPage,
  pagingCounter: state.convertReducer.pagingCounter,
  prevPage: state.convertReducer.prevPage,
  fetchErrorMEssage:state.convertReducer.errorMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  addConvertSuccess: state.convertReducer.addConvertSuccess
});
export default connect(mapStateToProps, null)(withTranslation()(Convert));