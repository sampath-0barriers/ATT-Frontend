import { gql } from "@apollo/client";

export const GET_USERS_QUERY = gql`
  query getUsers(
    $skip: Int
    $take: Int
    $orderBy: orderByInput
    $searchQuery: String
  ) {
    getUsers(
      skip: $skip
      take: $take
      orderBy: $orderBy
      searchQuery: $searchQuery
    ) {
      id
      name
      email
      phone
      address
      country
      company
      role
      isVerified
      isApproved
      createdAt
      updatedAt
    }
  }
`;

export const GET_SCANS_QUERY = gql`
  query getScans(
    $take: Int = 10
    $skip: Int = 0
    $orderBy: orderByInput
    $searchQuery: String
  ) {
    getScans(
      take: $take
      skip: $skip
      orderBy: $orderBy
      searchQuery: $searchQuery
    ) {
      id
      name
      url
      mode
      depth
      crawledUrls
      urlsToScan
      rulesToRun
      tags
      isScanned
      lastScannedAt
      scheduleAt
      createdByUser {
        id
        name
        email
        company
      }
      reports {
        id
        name
        reportUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_COMPANIES_QUERY = gql`
  query getCompanies(
    $skip: Int
    $take: Int
    $orderBy: orderByInput
    $searchQuery: String
  ) {
    getCompanies(
      skip: $skip
      take: $take
      orderBy: $orderBy
      searchQuery: $searchQuery
    ) {
      id
      name
      homePage
      address
      spokenContactName
      spokenContactEmail
      spokenContactPhone
      isScanned
      createdAt
    }
  }
`;

export const GET_REPORTS_QUERY = gql`
  query getReports(
    $skip: Int
    $take: Int
    $orderBy: orderByInput
    $searchQuery: String
  ) {
    getReports(
      skip: $skip
      take: $take
      orderBy: $orderBy
      searchQuery: $searchQuery
    ) {
      id
      companyName
      scannedUrl
      spokenContactName
      spokenContactEmail
      reportUrl
      clientIP
      createdAt
    }
  }
`;

export const REGISTER_USER_MUTATION = gql`
  mutation registerUser($data: registerUserInput!) {
    registerUser(data: $data) {
      id
      name
      email
      phone
      address
      country
      company
      role
      isVerified
      isApproved
      createdAt
      updatedAt
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation resendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`;

export const VERIFY_ACCOUNT_MUTATION = gql`
  mutation verifyAccount($verificationToken: String!) {
    verifyAccount(verificationToken: $verificationToken)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        phone
        address
        country
        company
        role
        isVerified
        isApproved
        createdAt
        updatedAt
      }
    }
  }
`;

export const FORGOT_PASSWORD_REQUEST_MUTATION = gql`
  mutation forgotPasswordRequest($email: String!) {
    forgotPasswordRequest(email: $email)
  }
`;


export const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($resetPasswordToken: String!, $newPassword: String!) {
    resetPassword(resetPasswordToken: $resetPasswordToken, newPassword: $newPassword)
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($userId: String!, $data: updateUserInput!) {
    updateUser(userId: $userId, data: $data) {
      id
      name
      email
      phone
      address
      country
      company
      role
      isVerified
      isApproved
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_SCAN_MUTATION = gql`
  mutation createScan($data: createScanInput!) {
    createScan(data: $data)
  }
`;

export const UPDATE_SCAN_MUTATION = gql`
  mutation updateScan($scanId: String!, $data: updateScanInput!) {
    updateScan(scanId: $scanId, data: $data)
  }
`;

export const DELETE_SCAN_MUTATION = gql`
  mutation deleteScan($scanId: String!) {
    deleteScan(scanId: $scanId)
  }
`;

export const RUN_SCAN_MUTATION = gql`
  mutation runScan($data: scanInput!) {
    runScan(data: $data)
  }
`;

export const RUN_BULK_SCANS_MUTATION = gql`
  mutation runBulkScans {
    runBulkScans
  }
`;

export const IMPORT_DATA_MUTATION = gql`
  mutation importData($file: Upload!) {
    importData(file: $file)
  }
`;

export const RUN_DEMO_SCAN_MUTATION = gql`
  mutation runDemoScan($data: scanInput!) {
    runDemoScan(data: $data)
  }
`;

export const UPDATE_COMPANY_MUTATION = gql`
  mutation updateCompany($companyId: String!, $data: updateCompanyInput!) {
    updateCompany(companyId: $companyId, data: $data)
  }
`;

export const DELETE_COMPANY_MUTATION = gql`
  mutation deleteCompany($companyId: String!) {
    deleteCompany(companyId: $companyId)
  }
`;

export const DELETE_REPORT_MUTATION = gql`
  mutation deleteReport($reportId: String!) {
    deleteReport(reportId: $reportId)
  }
`;
