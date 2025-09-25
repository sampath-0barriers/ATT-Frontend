/**
 * DeleteScan Component
 *
 * A React component for deleting multiple scans. It sends a DELETE request to the server with an array of scan IDs.
 *
 * @component
 * @param {boolean} isOpen - Indicates whether the modal is open or closed.
 * @param {function} toggle - Function to toggle the visibility of the modal.
 * @param {array} selectedScans - The list of scan objects to be deleted, each containing its details (e.g., `_id`).
 *
 * @example
 * <DeleteScan isOpen={isOpen} toggle={toggle} selectedScans={selectedScans} />
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Spinner, Alert } from 'reactstrap';
import { useAxios } from '../../utils/AxiosProvider';      // Custom hook for Axios client
import ConfirmationModal from './Confirmation';

const DeleteScan = ({ isOpen, toggle, selectedScans }) => {
    const client = useAxios();                             // Axios instance from a custom hook
    const [isLoading, setIsLoading] = useState(false);     // State to track the loading status of the delete operation
    const [errorMessage, setErrorMessage] = useState('');  // State for error messages, if any
    const [isDeleted, setIsDeleted] = useState(false);     // State to track whether the scans were successfully deleted

    /**
     * handleDelete function
     * 
     * This asynchronous function handles the delete request for the selected scans.
     * It sends an Axios DELETE request to the server with the array of scan IDs.
     * If the request succeeds, it updates the component state to show a success message.
     * If the request fails, an error message is displayed.
     *
     * @returns {void}
     */
    const handleDelete = async () => {
        setIsLoading(true);     // Begin loading, disable actions
        setErrorMessage('');    // Clear any existing error messages

        try {
            if (selectedScans && selectedScans.length > 0) { // Proceed only if scans are selected
                const scanRequestIds = selectedScans.map(scan => scan._id);                           // Extract an array of scan IDs

                // Make the DELETE request to the server with the array of scan IDs
                const response = await client.delete('/scan/delete-multiple-scans', { data: { scanRequestIds } });

                console.log('Scans deleted successfully:', response.data.deletedCount);
                setIsDeleted(true);                                               // Mark the scans as deleted for UI feedback

                // Automatically close the modal after 1 second
                setTimeout(() => {
                    toggle();                 // Toggle (close) the modal
                    window.location.reload(); // Reload the page to reflect the changes
                }, 1000);
            }
        } catch (error) {
            // Handle different types of errors and set appropriate error messages
            if (error.response && error.response.status === 404) {
                setErrorMessage('One or more scans not found.');

            // Handle 400 Bad Request error for invalid scan IDs
            } else if (error.response && error.response.status === 400) {
                setErrorMessage('Invalid scanRequestIds. Please try again.');
            
            // Handle other errors with a generic message
            } else {
                setErrorMessage('Error deleting scans. Please try again later.');
            }
            // Log the error to the console for debugging
            console.error('Error deleting scans:', error);
        
        } finally {
            setIsLoading(false); // End loading, re-enable actions
        }
    };

    /**
     * handleCancel function
     * 
     * This function handles the modal close event.
     * It resets necessary component states (isDeleted, errorMessage)
     * and closes the modal by invoking the `toggle` function.
     *
     * @returns {void}
     */
    const handleCancel = () => {
        setIsDeleted(false);  // Reset the isDeleted state to false
        setErrorMessage('');  // Clear any existing error messages
        toggle();             // Close the modal
    };

    /**
     * useEffect hook
     * 
     * This hook runs every time the `isOpen` prop changes.
     * When the modal is closed, it ensures the `isDeleted` state is reset,
     * so the UI behaves as expected when the modal is opened again.
     *
     * @returns {void}
     */
    useEffect(() => {
        if (!isOpen) {
            setIsDeleted(false); // Reset the deleted state when the modal is closed
        }
    }, [isOpen]); // Dependency array ensures the effect runs when `isOpen` changes

    return (
        <ConfirmationModal
            isOpen={isOpen}
            toggle={handleCancel}
            title="Delete Scans"
            message={
                isDeleted
                    ? "Scans deleted successfully!"
                    : selectedScans && selectedScans.length > 0
                    ? (
                        <>
                            <p>Are you sure you want to delete these scans?</p>
                            {selectedScans.map((scan, index) => (
                                <div key={scan._id}>
                                    {index + 1}. {scan.name || 'Unnamed Scan'}
                                </div>
                            ))}
                        </>
                    )
                    : "No Scans Selected"
            }
            onConfirm={handleDelete}
            confirmText="Delete"
            confirmColor="danger"
            loading={isLoading}
            success={isDeleted}
            error={errorMessage}
            successMessage="Scans deleted successfully!"
        />
    );
};

// Define prop types for the DeleteScan component
DeleteScan.propTypes = {
    isOpen: PropTypes.bool.isRequired,    // Boolean indicating if the modal is open
    toggle: PropTypes.func.isRequired,    // Function to toggle the modal visibility
    selectedScans: PropTypes.arrayOf(PropTypes.object).isRequired,  // Array of objects containing the scan data for deletion
};

export default DeleteScan;
