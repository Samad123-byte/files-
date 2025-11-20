import { useEffect, useState } from "react";
import { Tabs, RecordGrid, apiService, useGetTokenValue, GridPaginationComp,  } from "nimbus-kit";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeliveryManDefinition from "../Component/Screens/DeliveryMan/DeliveryManDefinition";
import { addBreadCrumbName } from "../store/slices/breadCrumbSlice";
import { gridSearchModel, gridModel, headers, articleModel } from "../Models/DeliveryManModel";

export default function DeliveryMan() {
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add breadcrumb
  useEffect(() => {
    dispatch(addBreadCrumbName("Delivery Man"));
  }, [dispatch]);

  const rightsArray = useGetTokenValue("DeliveryMan");
  const [isAllowed, setIsAllowed] = useState(false);
  const [userRights, setUserRights] = useState([]);
  const [isRecordTab, setIsRecordTab] = useState(true);
  const [mode, setMode] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resetState, setResetState] = useState(false);



  const totalPages = Math.ceil(totalRecords / rowsPerPage);





  useEffect(() => {
    setCurrentPage(1);
}, [rowsPerPage]);


  // Check access rights
  useEffect(() => {
    if (rightsArray != "") {
      if (rightsArray != null) {
        setUserRights(JSON.parse(rightsArray));
        if (!JSON.parse(rightsArray).includes("View")) {
          navigate("/app/home");
        } else {
          setIsAllowed(true);
        }
      } else {
        if (localStorage.GroupId == 1) {
          setUserRights(1);
          setIsAllowed(true);
        } else {
          navigate("/app/home");
        }
      }
    }
  }, [rightsArray]);

  // Fetch delivery man records on tab change or pagination change
  useEffect(() => {
    if (isRecordTab) fetchDeliveryMan();
  }, [isRecordTab, rowsPerPage, currentPage]);

const fetchDeliveryMan = () => {
  const searchPayload = {
    ...gridSearchModel,
    startIndex: (currentPage - 1) * rowsPerPage,
    endIndex: currentPage * rowsPerPage,
  };

  setRecords([]); // optional: clear while loading

  apiService({
    endpoint: apiUrl + "/DeliveryMan/search",
    method: "POST",
    data: searchPayload,
  })
    .then((res) => {
      if (res.data.success) {
        if (res.data.data.length > 0) {
          // Map API response to UI format
      const mappedRecords = res.data.data.map((item) => ({
  deliveryManId: item.deliveryManId,
  companyId: item.companyId,
  firstName: item.firstName,   // backend field
  mobile1: item.mobile1,       // backend field
  name: item.firstName,        // frontend display
  mobile: item.mobile1,        // frontend display
  description: item.description,
  store: `Store ${item.shopId}`, // dropdown label
  storeId: item.shopId,         // dropdown value
  shopId: item.shopId,          // backend field
  totalRecordCount: item.countRow,
}));

          setRecords(mappedRecords);
          setTotalRecords(mappedRecords[0].totalRecordCount || 0);
        } else {
          setRecords([]);
          setTotalRecords(0);
        }
      } else {
        toast.error(res.data.error || "Failed to fetch delivery man records");
      }
    })
    .catch((ex) => {
      console.error("API Error:", ex);
      toast.error("Something went wrong while fetching records");
    });
};




  // Handle double click on record
  const handleDblClick = (record) => {
    setSelectedRecord(record);
    setIsRecordTab(false);
    setMode("update");
  };

  // Handle Edit button click
  const handleEditClick = () => {
    if (!selectedRecord) {
      toast.error("Please select a valid record");
      return;
    }
    setIsRecordTab(false);
    setMode("update");
  };

  // Handle Create New
 const handleCreateNew = () => {
  setSelectedRecord(null);
  setMode("new");
  setIsRecordTab(false);
  setResetState(prev => !prev); // ✅ toggles to trigger Tabs internal handler
};


  // Handle Delete
  const handleDelete = async (record) => {
    if (!record || !record.deliveryManId) {
      toast.error("Invalid record selected for deletion");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await apiService({
        endpoint: apiUrl + "/DeliveryMan/delete",
        method: "POST",
        data: { deliveryManId: record.deliveryManId },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Delivery man deleted successfully");
        setRecords(records.filter((r) => r.deliveryManId !== record.deliveryManId));
        setTotalRecords(totalRecords - 1);
      } else {
        toast.error(res.data.message || "Failed to delete record");
      }
    } catch (ex) {
      console.error(ex);
      toast.error("Something went wrong while deleting");
    }
  };

  return (
    <>
      {isAllowed && (
        <>
          <Tabs
            tab2name={"Delivery Man"}
            setIsRecordTab={setIsRecordTab}
            isRecordTab={isRecordTab}
            mode={mode}
            setMode={setMode}
            handleEditClick={handleEditClick}
      resetState={resetState}
  setResetState={setResetState}
            articleModel={articleModel}
          />

          <div className="OutletMainContainer">
            {isRecordTab ? (
              <>
                <RecordGrid
                  currentPage={currentPage}
                  header={headers}
                  tablebody={records}
                  gridModel={gridModel}
                  handledblclick={handleDblClick}
                  setMode={setMode}
                  rowsPerPage={rowsPerPage}
                  setSelectedRecord={setSelectedRecord}
                  id={"deliveryManId"}
                  handleDelete={handleDelete}
                  disablePrint={userRights !== 1 && !userRights.includes("Print")}
                  disableCSV={userRights !== 1 && !userRights.includes("Export")}
                  csvName={"DeliveryMan"}
                  printHeading={"Delivery Man List"}
                />

                


                {totalRecords >= 10 && (
                  <GridPaginationComp
                    currentPage={currentPage}
                    totalRecords={totalRecords}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    setCurrentPage={setCurrentPage}
                    pageLength={records.length}
                   
                  />
                )}
              </>
            ) : (
              <DeliveryManDefinition
                mode={mode}
                setMode={setMode}
                records={records}
                setRecords={setRecords}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
                apiUrl={apiUrl}
                setIsRecordTab={setIsRecordTab}
                userRights={userRights}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
