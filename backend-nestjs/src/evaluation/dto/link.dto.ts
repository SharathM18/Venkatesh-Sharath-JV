export class GenerateTestLinkDto {
  applicant_id: string;
  name: string;
  email: string;
  phone: string;
  experience_level_id: string;
  primary_skill_id: string;
  secondary_skill_id?: string;
  job_id: string;
  ta_id: string;
}

export class SaveAnswerDto {
  applicant_id: string;
  test_attempt_id: string;
  mcq_question_id: string;
  selected_option_id: string;
}
