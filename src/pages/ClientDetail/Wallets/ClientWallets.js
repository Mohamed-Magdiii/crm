import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Input, Spinner, Label
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import FeatherIcon from "feather-icons-react";

// i18n 
import { withTranslation } from "react-i18next";
import { fetchClientWallets, changeStatus } from "store/wallet/action";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import ClientAddWallet from "./ClientAddWallet";
import DeleteModal from "components/Common/DeleteModal";
import WalletEditModal from "./WalletEditModal";
import QrPukModal from "./QrPukModal";
import { captilazeFirstLetter } from "common/utils/manipulateString";
// import { editBankAccount } from "store/bankAccount/actions";

function ClientWallets(props) {
  const clientId = props.clientId;
  const [sizePerPage, setSizePerPage] = useState(5);
  const [deleteModal, setDeleteModal] = useState(false);
  const [walletEditModal, setWalletEditModal] = useState(false);
  const [pukModal, setPukEditModal] = useState(false);
  const [puk, setPuk] = useState("");

  const dispatch = useDispatch();
  const loadClientWalletDetails = () => {
    dispatch(fetchClientWallets({
      belongsTo: clientId
    }));
  };
  useEffect(() => {
    loadClientWalletDetails();
  }, []);
  const updateStatus = (event, item, index) => { 
    dispatch(changeStatus(item._id, !item.active ? true : false, index));
    event.preventDefault();
  }; 
  const pukHandeler = (puk) => {
    setPuk(puk);
    setPukEditModal(true);
    // console.log(puk);
  };

  const columns = [ 
    {
      dataField: "asset",
      text: props.t("Asset"),
      formatter: (item) => (
        captilazeFirstLetter(item.asset)
      )
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (item) => (
        item.amount === " " ? "-" : parseFloat(item.amount)
      )
    },
    {
      dataField: "isCrypto",
      text: props.t("Crypto"),
      formatter: (item) => (
        item.isCrypto ? props.t("Crypto wallet") : props.t("Traditional wallet")
      )
    },
    {
      dataField: "address",
      text: props.t("Address"),
      formatter: (item) => {
        if (item.isCrypto)
          return (
            <Link to="#" onClick={() => { pukHandeler(item.puk) }}>
              <FeatherIcon icon="eye" />
            </Link>
          );
        else
          return "";
        // return <i className="mdi mdi-close-circle-outline font-size-22" style={{ color: "red" }}></i>;
      },
    },
    {
      dataField: "freezeAmount",
      text: props.t("Freeze Amount"),
      formatter: (item) => (
        item.freezeAmount === " " ? "N/A" : parseFloat(item.freezeAmount)
      )
    },
    {
      dataField: "active",
      text: props.t("Status"),
      formatter: (item, index) => (
        <div className="d-flex gap-3">
          {(props.changeStatusLoading && props.changeStatusLoadingIndex === index) ? <React.Fragment>
            <Spinner className="ms-2" color="primary" />
          </React.Fragment> : <React.Fragment>
            <Input
              checked={item.active}
              type="checkbox"
              onChange={(e) => { updateStatus(e, item, index) }}
              id={item.id}
              switch="none"
            />
            <Label className="me-1" htmlFor={item.id} data-on-label="" data-off-label=""></Label>
          </React.Fragment>}
        </div>

      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: () => (
        <div className="d-flex gap-3">
          <Link className="text-success" to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => { }}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => { }}
            ></i>
          </Link>
        </div>
      )
    }
  ];

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle>
                    {props.t("Client wallets list")} ({props.totalWalletDocs})
                  </CardTitle>
                  <ClientAddWallet clientId={clientId} />
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
                          props.totalWalletDocs === 0
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
                            <Tbody className="text-center">
                              {props.loading && <TableLoader colSpan={4} />}
                              {(!props.loading && props.docs) && props.docs.map((row, rowIndex) =>
                                <Tr key={rowIndex}>
                                  {columns.map((column, index) =>
                                    <Td key={`${rowIndex}-${index}`}>
                                      {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
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
                        onChange={loadClientWalletDetails}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <QrPukModal
            open={pukModal}
            puk={puk}
            onClose={() => { setPukEditModal(false) }}
          />
          {<DeleteModal
            loading={props.deleteLoading}
            // onDeleteClick={deleteBankAccountFunction} 
            show={deleteModal}
            onCloseClick={() => { setDeleteModal(false) }}
          />}
          {<WalletEditModal
            open={walletEditModal}
            // selectedBankAccount={selectedBankAccount} 
            onClose={() => { setWalletEditModal(false) }}
          // bankAccountUpdateHandler={bankAccountUpdateHanlder} 
          />}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.walletReducer.loading,
  error: state.walletReducer.error,
  errorDetails: state.walletReducer.errorDetails,
  success: state.walletReducer.success,

  changeStatusLoading: state.walletReducer.changeStatusLoading,
  changeStatusLoadingIndex: state.walletReducer.changeStatusLoadingIndex,

  docs: state.walletReducer.docs,
  totalWalletDocs: state.walletReducer.totalWalletDocs
});

export default connect(mapStateToProps, null)(withTranslation()(ClientWallets));
