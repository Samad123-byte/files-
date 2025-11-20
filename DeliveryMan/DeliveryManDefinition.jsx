import React, { useEffect, useState, useRef } from "react";
import {
  Input,
  InputComment,
  SaveUpdateBtn,
  ConfirmationPopup,
  apiService,
} from "nimbus-kit";
import { toast } from "react-toastify";
import { deliveryManModel } from "../../../Models/DeliveryManModel";
import DropDown from "../../Controls/DropDown/Dropdown";

export default function DeliveryManDefinition({
  mode,
  setMode,
  selectedRecord,
  setSelectedRecord,
  records,
  setRecords,
  apiUrl,
  setIsRecordTab,
  userRights,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalBody, setModalBody] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [actionState, setActionState] = useState("");
  const [store, setStore] = useState(null);


  const firstNameRef = useRef(null);

  // Focus first input always
  const focusFirstInput = () => {
    firstNameRef.current?.focus();
  };

  // Reset / New mode load
  useEffect(() => {
    if (mode === "new") {
      setFirstName("");
      setLastName("");
      setMobile1("");
      setMobile2("");
      setDescription("");
    }
    focusFirstInput();
  }, [mode]);

  // Update mode load
  useEffect(() => {
    if (mode === "update" && selectedRecord) {
      setFirstName(selectedRecord.firstName || "");
      setLastName(selectedRecord.lastName || "");
      setMobile1(selectedRecord.mobile1 || "");
      setMobile2(selectedRecord.mobile2 || "");
      setDescription(selectedRecord.description || "");
      
            if (selectedRecord.shopId) {
      setStore({
        value: parseInt(selectedRecord.shopId),
        label: selectedRecord.shopName || `Store ${selectedRecord.shopId}`,
      });
    } else {
      setStore(null);
    }
    }
  }, [mode, selectedRecord]);

  // Validation
  const validate = () => {
    if (!firstName || firstName.trim() === "") {
      toast.error("First Name is required");
      focusFirstInput();
      return false;
    }

    if (!mobile1 || mobile1.trim() === "") {
      toast.error("Mobile No is required");
      return false;
    }

    const onlyNumbers = /^[0-9]+$/;
    if (!onlyNumbers.test(mobile1.trim())) {
      toast.error("Mobile No must contain only numbers");
      return false;
    }

    return true;
  };

  // Button Actions
  const handleSave = () => {
    if (!validate()) return;
    setModalBody("Do you want to Save this record?");
    setModalTitle("Saving..!");
    setActionState("Save");
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!validate()) return;
    setModalBody("Do you want to Update this record?");
    setModalTitle("Updating..!");
    setActionState("Update");
    setShowModal(true);
  };

  const handleDelete = () => {
    setModalBody("Do you want to Delete this record?");
    setModalTitle("Deleting..!");
    setActionState("Delete");
    setShowModal(true);
  };

  const handleReset = () => {
    if (mode === "new") {
      setFirstName("");
      setLastName("");
      setMobile1("");
      setMobile2("");
      setDescription("");
    } else {
      setFirstName(selectedRecord.firstName);
      setLastName(selectedRecord.lastName);
      setMobile1(selectedRecord.mobile1);
      setMobile2(selectedRecord.mobile2);
      setDescription(selectedRecord.description);
    }
  };

  // Confirm Handler
  const onConfirm = () => {
    if (actionState === "Save") addRecord();
    else if (actionState === "Update") updateRecord();
    else if (actionState === "Delete") deleteRecord();
  };

  // API functions
  const addRecord = () => {
    deliveryManModel.firstName = firstName.trim();
    deliveryManModel.lastName = lastName.trim();
    deliveryManModel.mobile1 = mobile1.trim();
    deliveryManModel.mobile2 = mobile2.trim();
    deliveryManModel.description = description.trim();
    deliveryManModel.shopId = store?.value || 0;


    apiService({
      endpoint: apiUrl + "/DeliveryMan/add",
      method: "POST",
      data: deliveryManModel,
    })
      .then((res) => {
        if (res.data.success) {
          const newRecord = {
            deliveryManId: res.data.data.deliveryManId,
            companyId: deliveryManModel.companyId || 0,
            shopId: deliveryManModel.shopId || 0,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            mobile1: mobile1.trim(),
            mobile2: mobile2.trim(),
            description: description.trim(),
            readOnly: 0,
            sortOrder: 0,
            totalRecordCount: records.length + 1,
          };
          setSelectedRecord(newRecord);
          setRecords((prev) => [newRecord, ...prev]);
          setMode("update");
          toast.success(res.data.message || "Record added successfully");
        } else {
          toast.error(res.data.error || "Failed to add record");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const updateRecord = () => {
    const updated = {
      ...selectedRecord,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      mobile1: mobile1.trim(),
      mobile2: mobile2.trim(),
      description: description.trim(),
        shopId: store?.value || 0,
    };

    apiService({
      endpoint: apiUrl + "/DeliveryMan/update",
      method: "POST",
      data: updated,
    })
      .then((res) => {
        if (res.data.success) {
          setRecords((prev) =>
            prev.map((p) =>
              p.deliveryManId === updated.deliveryManId ? updated : p
            )
          );
          setSelectedRecord(updated);
          toast.success("Record updated successfully");
        } else {
          toast.error(res.data.error);
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const deleteRecord = () => {
    const payload = { deliveryManId: selectedRecord.deliveryManId };

    apiService({
      endpoint: apiUrl + "/DeliveryMan/delete",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        if (res.data.success) {
          setRecords((prev) =>
            prev.filter((i) => i.deliveryManId !== selectedRecord.deliveryManId)
          );
          setMode("new");
          setIsRecordTab(true);
          toast.success("Record deleted successfully");
        } else {
          toast.error(res.data.error);
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  return (
    <>

<DropDown
  label="Store"
  placeholder="--Select Store--"
  options={"shops"}
  selectedOption={store}
  setSelectedOption={setStore} // just pass the object
/>



      <div className="cityNameContainer">
        <Input
          label="First Name"
          important="true"
          inputVal={firstName}
          setInputVal={setFirstName}
          inputRef={firstNameRef}
          maxLength={50}
        />
      </div>

      <div className="cityNameContainer">
        <Input
          label="Last Name"
          inputVal={lastName}
          setInputVal={setLastName}
          maxLength={50}
        />
      </div>

      <Input
        label="Mobile 1"
        inputVal={mobile1}
        setInputVal={(v) => {
          if (/^[0-9]*$/.test(v)) setMobile1(v);
        }}
        maxLength={20}
      />

      <Input
        label="Mobile 2"
        inputVal={mobile2}
        setInputVal={(v) => {
          if (/^[0-9]*$/.test(v)) setMobile2(v);
        }}
        maxLength={20}
      />

      <div className="cityCommentContainer">
        <InputComment
          label="Description"
          inputVal={description}
          setInputVal={setDescription}
        />
      </div>

      <SaveUpdateBtn
        handleSave={handleSave}
        handleReset={handleReset}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        showUnderLine={true}
        mode={mode}
        disableSave={userRights !== 1 && !userRights.includes("Save")}
        disableUpdate={userRights !== 1 && !userRights.includes("Update")}
        disableDelete={userRights !== 1 && !userRights.includes("Delete")}
      />

      {showModal && (
        <ConfirmationPopup
          setShowModal={setShowModal}
          modalTitle={modalTitle}
          modalBody={modalBody}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
}
