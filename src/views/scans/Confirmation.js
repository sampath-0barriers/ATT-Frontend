import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Spinner } from 'reactstrap';

const Confirmation = ({
    isOpen,
    toggle,
    title = 'No title',
    message = '',
    onConfirm,
    confirmText = 'Confirm',
    confirmColor = 'primary',
    loading = false,
    success = false,
    error = null,
    successMessage = 'Action completed successfully!',
    disableConfirm = false,
    cancelText = 'Cancel'
}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
                {error && (
                    <Alert color="danger" className="mb-3">
                        {error}
                    </Alert>
                )}
                {success ? (
                    <Alert color="success">
                        {successMessage}
                    </Alert>
                ) : (
                    <p>{message}</p>
                )}
            </ModalBody>
            <ModalFooter>
                <Button
                    color={confirmColor}
                    onClick={onConfirm}
                    disabled={loading || success || disableConfirm}
                >
                    {loading ? <Spinner size="sm" /> : confirmText}
                </Button>
                <Button color="secondary" onClick={toggle} disabled={loading}>
                    {cancelText}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

Confirmation.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default Confirmation;
