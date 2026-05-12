export enum ErrorCode {
  // system errors
  UNKNOWN = "999999",
  VALIDATION = "999422",
  FORBIDDEN = "999403",
  UNAUTHORIZED = "999401",

  // authorization errors
  WRONG_CREDENTIALS = "000001",
  USER_REGISTERED = "000002",
  EMAIL_NOT_FOUND = "000003",
  AUTH_USER_NOT_FOUND = "000004",
  INVALID_CODE = "000005",
  WRONG_OLD_PASSWORD = "000006",
  AUTH_USER_INACTIVE = "000007",
  EXPIRED_CODE = "000008",

  // role errors
  ROLE_NOT_FOUND = "001001",
  ROLE_DEFAULT_REQUIRED = "001002",

  // skill errors
  SKILL_CATEGORY_NOT_FOUND = "003001",
  SKILL_NOT_FOUND = "003002",

  // file errors
  FILE_NOT_FOUND = "004001",
  FILE_S3_KEY_MISMATCH = "004002",

  // project errors
  PROJECT_CATEGORY_NOT_FOUND = "005001",
  PROJECT_NOT_FOUND = "005002",
}

export const errorMessages: Record<ErrorCode, string> = {
  // system
  "999999": "Unknown error",
  "999422": "Validation error",
  "999403": "Forbidden",
  "999401": "Unauthorized",
  // authorization
  "000001": "ID or password is incorrect",
  "000002": "User registered",
  "000003": "Email not found",
  "000004": "You should login in first",
  "000005": "Invalid verify code",
  "000006": "Current password is incorrect",
  "000007": "This account is INACTIVE",
  "000008": "Expired code",

  // role
  "001001": "Role not found",
  "001002": "Cannot unset default role, assign another role as default first",

  // skill
  "003001": "Skill category not found",
  "003002": "Skill not found",

  // file
  "004001": "File not found",
  "004002": "File s3Key does not match isPublic flag",

  // project
  "005001": "Project category not found",
  "005002": "Project not found",
};
