import React from "react";

const AlwaysOpenModal = (props) => {
  return (
    <div>
      <input type="checkbox" checked={true} readOnly className="modal-toggle" />
      {true ? (
        <div className="modal">
          <div className="modal-box bg-grey-500">
            <h2>Always Open Modal</h2>
            <p>This modal is always open.</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AlwaysOpenModal;
