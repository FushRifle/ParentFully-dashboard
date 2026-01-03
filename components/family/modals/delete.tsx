import React from 'react';
import { Modal, Button, Text } from '@nextui-org/react';

export const DeleteUserModal = ({ visible, closeHandler, userName, onConfirm }) => {
     return (
          <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
               <Modal.Header>
                    <Text id="modal-title" size={18}>
                         Confirm <Text b size={18}>Deletion</Text>
                    </Text>
               </Modal.Header>
               <Modal.Body>
                    <Text>
                         Are you sure you want to delete <b>{userName}</b>? This action cannot be undone and all associated data will be lost.
                    </Text>
               </Modal.Body>
               <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>Cancel</Button>
                    <Button auto onClick={onConfirm} color="error">Delete User</Button>
               </Modal.Footer>
          </Modal>
     );
};