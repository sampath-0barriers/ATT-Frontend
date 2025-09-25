import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Form,
    Input,
    Container,
    Row,
    Col,
    Table,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Button,
    ButtonToolbar,
    Pagination,
    PaginationItem,
    PaginationLink
} from 'reactstrap';
import { Icon } from '@blueprintjs/core';
import { Trash2, Play, FileText, Eye } from 'lucide-react';
import UploadPDF from './UploadPDF';
import ShowPDF from './ShowPDF';
import PDFScanResults from './PDFScanResults';
import Confirmation from './Confirmation';
import ComponentCard from '../../components/ComponentCard';
import formatTimestamp from '../../utils/DateTimeConverter';
import { useAxios } from "../../utils/AxiosProvider";
import { errorNotification } from '../../utils';
import sound from '../../sounds/kick-bass.mp3';

const PDFAccessibility = () => {
    const isSoundOn = useSelector((state) => state.customizer.isSoundOn);
    const [isUploadPDFOpen, setUploadPDFOpen] = useState(false);       // control the visibility of uploading a pdf

    // Filtering and pagination
    const [searchTerm, setSearchTerm] = useState('');             // stores the search term in the search bar
    const [currentPage, setCurrentPage] = useState(1);   // current page
    const [itemsPerPage, setItemsPerPage] = useState(10); // items per page

    // states for scan details and show pdf
    const [isScanResultsOpen, setIsScanResultsOpen] = useState(false);
    const [scanDetails, setScanDetails] = useState([]);
    const [scanResults, setScanResults] = useState([]);

    const [isShowPDFOpen, setIsShowPDFOpen] = useState(false);
    const [pdfFileData, setPdfFileData] = useState(null);
    const [pdfFileName, setPdfFileName] = useState(null);

    // stores the scan status of the clicked scan (to show its results)
    const [clickedScanStatus, setClickedScanStatus] = useState('');

    const [scanInRow, setScanInRow] = useState(null);

    // States for individual scan actions
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const [isRunConfirmOpen, setIsRunConfirmOpen] = useState(false);
    const [runLoading, setRunLoading] = useState(false);
    const [runError, setRunError] = useState('');
    const [runSuccess, setRunSuccess] = useState(false);

    const client = useAxios();

    // sound
    var sounds = new Audio(sound);

    // filter the scan details based on the search term
    const filteredScans = scanDetails.filter(scan =>
        scan.fileName && scan.fileName.toLowerCase().replace(/\.pdf$/i, '').includes(searchTerm.toLowerCase())
    );

    // slice the filteredScans array based on the current page and items per page and calculate total pages
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPageScans = filteredScans.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScans.length / itemsPerPage);

    const itemsPerPageArray = [10, 25, 50, 100]; // items per page options

    const playSound = () => {
        if (isSoundOn)
            sounds.play();
    };

    // fetch scan details from the server
    const fetchScanDetails = async () => {
        try {
            const response = await client.get('/pdf-scans');
            setScanDetails(response.data.reverse());
            console.log(response.data);
            return response;
        } catch (error) {
            console.error('Error fetching Scan Details:', error);
            const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
            errorNotification('Error', errMsg);
        }
    };

    // get scan details to populate the rows
    useEffect(() => {
        fetchScanDetails();
    }, []);

    // fetch scan results for a particular scanId
    const fetchScanResults = async (scanRequestId) => {
        try {
            const response = await client.get(`/pdf-scan/results/${scanRequestId}`);
            setScanResults(response.data);
        } catch (error) {
            console.error('Error fetching Scan Results:', error);
            const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
            errorNotification('Error', errMsg);
        }
    };

    // refresh the scan details
    const handleRefresh = () => {
        fetchScanDetails();
        playSound();
    };

    // toggle the visibility of the new scan modal
    const toggleUploadPDF = () => {
        setUploadPDFOpen(!isUploadPDFOpen);
    };

    // open the new scan modal
    const openUploadPDF = () => {
        setUploadPDFOpen(true);
        playSound();
    };

    // open the scan details modal
    const toggleScanResults = () => {
        setIsScanResultsOpen(!isScanResultsOpen);
    };

    const openScanResults = async (scanId) => {
        await fetchScanResults(scanId);
        toggleScanResults(); // Open the active scan modal
    };

    // open the show PDF modal
    const toggleShowPDF = () => {
        setIsShowPDFOpen(!isShowPDFOpen);
    };

    const openShowPDF = async (fileName, fileData) => {
        setPdfFileName(fileName);
        setPdfFileData(fileData);
        toggleShowPDF();
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const getPaginationItems = (currentPage, totalPages) => {
        const paginationItems = [];
        const maxVisiblePages = 5;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {                     // currentPage is near the start
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + 2 >= totalPages) { // currentPage is near the end
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {                                    // currentPage is in the middle
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        if (startPage > 2) {
            paginationItems.push(1);
            paginationItems.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(i);
        }
        if (endPage < totalPages - 1) {
            paginationItems.push('...');
            paginationItems.push(totalPages);
        }

        return paginationItems;
    };

    const openDeleteConfirm = (scan) => {
        setScanInRow(scan);
        setIsDeleteConfirmOpen(true);
        setDeleteError('');
        setDeleteSuccess(false);
    };

    const closeDeleteConfirm = () => {
        setScanInRow(null);
        setIsDeleteConfirmOpen(false);
        setDeleteError('');
        setDeleteSuccess(false);
    };

    const handleDirectDelete = async () => {
        if (!scanInRow) return;

        setDeleteLoading(true);
        setDeleteError('');

        try {
            const scanRequestIds = [scanInRow._id];
            await client.delete(`pdf-scan/delete/${scanInRow._id}`);

            setDeleteSuccess(true);
            setTimeout(() => {
                closeDeleteConfirm();
                fetchScanDetails();
            }, 1000);
        } catch (error) {
            if (error.response?.status === 404) {
                setDeleteError('Scan not found.');
            } else if (error.response?.status === 400) {
                setDeleteError('Invalid scan ID. Please try again.');
            } else {
                const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
                errorNotification('Error', errMsg);
                setDeleteError('Error deleting scan. Please try again later.');
            }
            console.error('Error deleting scan:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const openRunConfirm = (scan) => {
        setScanInRow(scan);
        setIsRunConfirmOpen(true);
        setRunError('');
        setRunSuccess(false);
    };

    const closeRunConfirm = () => {
        setScanInRow(null);
        setIsRunConfirmOpen(false);
        setRunError('');
        setRunSuccess(false);
    };

    const handleDirectRun = async () => {
        if (!scanInRow) return;

        setRunLoading(true);
        setRunError('');

        try {
            const scans = {
                scanRequestIdList: [scanInRow._id],
            };

            await client.post(`/pdf-scan/run/${scanInRow._id}`);
            setRunSuccess(true);

            setTimeout(() => {
                closeRunConfirm();
                fetchScanDetails();
            }, 1000);
        } catch (error) {
            if (error.response?.status === 404) {
                setRunError('Scan not found.');
            } else if (error.response?.status === 400) {
                setRunError('Invalid scan ID. Please try again.');
            } else {
                setRunError('Error running scan. Please try again later.');
            }
            console.error('Error running scan:', error);
        } finally {
            setRunLoading(false);
        }
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col sm="20">
                    <ComponentCard>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex align-items-center'>
                                <h4 style={{ marginRight: '10px' }}>PDF Accessibility Scan (WCAG 2.0)</h4>
                            </div>
                            <div>
                                <ButtonToolbar>
                                    <Form className='m-1'>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">
                                                    <Icon icon="search" />
                                                </span>
                                            </div>
                                            <Input
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                placeholder="Search..."
                                            />
                                        </div>
                                    </Form>
                                    <Button color='info' onClick={openUploadPDF} className='text-center m-1'>
                                        <Icon icon='upload' color='white' /> Upload PDF
                                    </Button>
                                    <UploadPDF isOpen={isUploadPDFOpen} toggle={toggleUploadPDF} />
                                    <Button color='info' onClick={handleRefresh} className='text-center m-1'>
                                        <Icon icon='refresh' color='white' /> Refresh
                                    </Button>
                                </ButtonToolbar >
                            </div >
                        </div >
                    </ComponentCard >
                </Col >
            </Row >

            <Row>
                <Col sm="20">
                    <ComponentCard title="PDF Scan Details">
                        <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', overflow: 'hidden' }}>
                            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                                <Table bordered hover size="sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            {/* <th style={{width: '7%', textAlign: "center"}}>Results</th> */}
                                            <th style={{ width: '15%', textAlign: "center" }}>File Name</th>
                                            <th style={{ width: '15%', textAlign: "center" }}>Upload Date</th>
                                            {/* <th style={{width: '10%', textAlign: "center"}}>Document</th> */}
                                            <th style={{ width: '15%', textAlign: "center" }}>Score</th>
                                            <th style={{ width: '15%', textAlign: "center" }}>Last Run At</th>
                                            <th style={{ width: '7%', textAlign: "center" }}>Actions</th>
                                        </tr>
                                    </thead >
                                    <tbody className='bordered'>
                                        <PDFScanResults isOpen={isScanResultsOpen} toggle={toggleScanResults} scanResults={scanResults} scanStatus={clickedScanStatus} />
                                        <ShowPDF isOpen={isShowPDFOpen} toggle={toggleShowPDF} fileName={pdfFileName} fileData={pdfFileData} />
                                        {currentPageScans.map((scan, index) => (
                                            <tr key={scan.id}>
                                                {/* <td style={{textAlign: 'center'}}>
                                  <Button color="link" id={`results-${index}`} onClick={() => openScanResults(scan._id)}>
                                      <Icon icon="search"/>
                                  </Button>
                              </td> */}
                                                <td>{scan.fileName.replace(/\.pdf$/i, '') ?? '-'}</td>
                                                <td>{scan?.uploadDate ? formatTimestamp(scan.uploadDate) : "-"}</td>
                                                {/* <td style={{textAlign: 'center'}}>
                              </td> */}
                                                <td>{scan?.mostRecentScore ? (scan.mostRecentScore * 100).toFixed(1) : "-"}</td>
                                                <td>{scan?.lastRan ? formatTimestamp(scan.lastRan) : "-"}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button
                                                        color="link"
                                                        className="p-0"
                                                        onClick={() => openRunConfirm(scan)}
                                                        title='Run'
                                                        aria-label='Run'
                                                    >
                                                        <Play size={18} className="text-primary" />
                                                    </Button>

                                                    <Button
                                                        color="link"
                                                        className="p-0"
                                                        onClick={() => openDeleteConfirm(scan)}
                                                        title='Delete'
                                                        aria-label='Delete'
                                                    >
                                                        <Trash2 size={18} className="text-danger" />
                                                    </Button>
                                                    <Button color="link" id={`results-${index}`} onClick={() => openScanResults(scan._id)} className="p-0" title='Result' aria-label='Result'>
                                                        <FileText size={18} />
                                                    </Button>
                                                    <Button color="link" id={`document-${index}`} onClick={() => openShowPDF(scan.fileName, scan.fileData)} className="p-0" title='Show File' aria-label='Show File'>
                                                        <Eye size={18} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody >
                                </Table >
                            </div >

                            {/* pagination controls */}
                            < Row >
                                <div className='d-flex align-items-center justify-content-center'>
                                    <span className='mx-2'>
                                        Showing {Math.min(indexOfFirstItem + 1, filteredScans.length)} to {Math.min(indexOfLastItem, filteredScans.length)} of {filteredScans.length} entries
                                    </span>

                                    <Pagination aria-label="Page navigation" className='m-1'>
                                        <PaginationItem disabled={currentPage === 1}>;
                                            <PaginationLink first onClick={() => handlePageChange(1)} />
                                        </PaginationItem >

                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                        </PaginationItem>;

                                        {
                                            getPaginationItems(currentPage, totalPages).map((item, index) => (
                                                <PaginationItem key={index} active={item === currentPage} disabled={item === '...'}>
                                                    {item === '...' ? (
                                                        <PaginationLink disabled>{item}</PaginationLink>
                                                    ) : (
                                                        <PaginationLink onClick={() => handlePageChange(item)}>{item}</PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))
                                        }

                                        <PaginationItem disabled={currentPage === totalPages}>
                                            <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                        </PaginationItem>

                                        <PaginationItem disabled={currentPage === totalPages}>
                                            <PaginationLink last onClick={() => handlePageChange(totalPages)} />
                                        </PaginationItem>
                                    </Pagination >

                                    <UncontrolledDropdown>
                                        <DropdownToggle caret color="white" className='mx-2'>
                                            {itemsPerPage}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {itemsPerPageArray.map((numItems) => (
                                                <DropdownItem key={numItems} onClick={() => handleItemsPerPageChange(numItems)}>
                                                    {numItems}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div >
                            </Row >
                        </div >
                    </ComponentCard >
                </Col >
            </Row >

            <Confirmation
                isOpen={isRunConfirmOpen}
                toggle={closeRunConfirm}
                title="Run Scan"
                message={`Are you sure you want to run the scan for file "${scanInRow?.fileName || 'Unnamed Scan'}"?`}
                onConfirm={handleDirectRun}
                confirmText="Run Scan"
                confirmColor="primary"
                loading={runLoading}
                success={runSuccess}
                error={runError}
                successMessage="Scan started successfully!"
            />

            <Confirmation
                isOpen={isDeleteConfirmOpen}
                toggle={closeDeleteConfirm}
                title="Delete Scan"
                message={`Are you sure you want to delete the scan for file "${scanInRow?.fileName || 'Unnamed Scan'}"?`}
                onConfirm={handleDirectDelete}
                confirmText="Delete"
                confirmColor="danger"
                loading={deleteLoading}
                success={deleteSuccess}
                error={deleteError}
                successMessage="Scan deleted successfully!"
            />
        </Container >
    );
};

export default PDFAccessibility;
