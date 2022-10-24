import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Center,
  Divider as ChakraDivider,
} from '@chakra-ui/react';
import { ViewIcon, EmailIcon, CheckIcon } from '@chakra-ui/icons';

// types
import {
  ProfileFormData,
  InformationRegistrationReason,
  RegistrationIdentityType,
  Sex,
} from '../../@types';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import PdfForm from '../PdfForm/PdfForm';

const Divider = () => (
  <Center h="24px">
    <ChakraDivider color="white" />
  </Center>
);

interface Props {
  profileApiData: Partial<ProfileFormData> | undefined;
  saveUserConsent: () => void;
  isLoading: boolean;
}

export default function RegistrationDataForm(props: Props) {
  const { profileApiData, saveUserConsent, isLoading } = props;
  const { openModal, closeModal } = useModal();

  const { handleSubmit, register, reset } = useForm<ProfileFormData>({
    mode: 'onSubmit',
    defaultValues: {
      registrationIdentityType: RegistrationIdentityType.PersonalIdentityCode,
      sex: Sex.Male,
      reasonForRecordingInformation:
        InformationRegistrationReason.WorkingInFinland,
    },
  });

  /**
   * After user have given consent, reset the form with pre-defined values from user profile.
   */
  useEffect(() => {
    if (profileApiData?.immigrationDataConsent) {
      reset({ ...profileApiData });
    }
  }, [profileApiData, reset]);

  /**
   * Handle form submit, open PDF preview.
   */
  const doSubmit = useCallback(
    async (values: any) => {
      try {
        openModal({
          title: 'Form Preview',
          content: <PdfForm profileData={values as ProfileFormData}></PdfForm>,
          footerContent: (
            <Button colorScheme={'blue'} leftIcon={<EmailIcon />}>
              Send
            </Button>
          ),
          useBodyPadding: false,
          size: '4xl',
        });
      } catch (e) {
        console.log(e);
      }
    },
    [openModal]
  );

  /**
   * Handle user profile data consent ('immigrationDataConsent')
   */
  const handleConsent = useCallback(() => {
    openModal({
      title: 'Use your profile data',
      content: (
        <Stack>
          <Text>You need to give your consent for this to work, okay?</Text>
          <Button
            colorScheme="blue"
            onClick={() => {
              saveUserConsent();
              closeModal();
            }}
          >
            Okay
          </Button>
        </Stack>
      ),
    });
  }, [closeModal, openModal, saveUserConsent]);

  return (
    <Stack maxW="70ch" spacing={4}>
      <Flex
        alignItems="end"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Heading color={'blue.900'}>Register foreigner</Heading>
          <Text color={'blue.900'}>
            Input information about your registration
          </Text>
        </Box>
        <Button
          colorScheme={
            profileApiData?.immigrationDataConsent ? 'green' : 'blue'
          }
          onClick={handleConsent}
          isLoading={isLoading}
          disabled={profileApiData?.immigrationDataConsent}
          {...(profileApiData?.immigrationDataConsent && {
            leftIcon: <CheckIcon />,
          })}
        >
          {profileApiData?.immigrationDataConsent
            ? 'Profile data used'
            : 'Pre-fill with your profile'}
        </Button>
      </Flex>
      <Stack
        p={6}
        bg={'blue.700'}
        color={'white'}
        rounded="xl"
        boxShadow="lg"
        position="relative"
      >
        <fieldset disabled={isLoading}>
          <form onSubmit={handleSubmit(doSubmit)}>
            <Stack spacing={4}>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl id="lastName">
                  <FormLabel>Family name</FormLabel>
                  <Input {...register('lastName')} disabled={isLoading} />
                </FormControl>
                <FormControl id="previousFamilyNames">
                  <FormLabel>Previous family names</FormLabel>
                  <Input
                    {...register('previousFamilyNames')}
                    disabled={isLoading}
                  />
                </FormControl>
              </Flex>

              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl id="firstName">
                  <FormLabel>Given names</FormLabel>
                  <Input {...register('firstName')} type={'text'} />
                </FormControl>
                <FormControl id="previousGivenName">
                  <FormLabel>Previous given names</FormLabel>
                  <Input {...register('previousGivenNames')} />
                </FormControl>
              </Flex>

              <Divider />

              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  w={{ base: 'full', md: '50%' }}
                  gap={4}
                >
                  <FormControl id="dateOfBirth">
                    <FormLabel>Date of birth</FormLabel>
                    <Input
                      {...register('dateOfBirth')}
                      placeholder={'E.g. 1.1.2023'}
                      type="date"
                    />
                    <FormHelperText color="white  ">
                      Input date in d.m.yyyyy format
                    </FormHelperText>
                  </FormControl>
                  <FormControl id="sex">
                    <FormLabel>Sex</FormLabel>
                    <RadioGroup defaultValue={Sex.Male}>
                      <Stack direction={'column'}>
                        <Radio {...register('sex')} value={Sex.Male}>
                          Male
                        </Radio>
                        <Radio {...register('sex')} value={Sex.Female}>
                          Female
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Flex>
                <Flex direction="column" gap={2}>
                  <FormControl id="registrationIdentityType">
                    <FormLabel>
                      Personal identity code or Tax id no. in the country of
                      residence
                    </FormLabel>
                    <RadioGroup
                      defaultValue={
                        RegistrationIdentityType.PersonalIdentityCode
                      }
                    >
                      <Stack direction={'row'}>
                        <Radio
                          {...register('registrationIdentityType')}
                          value={RegistrationIdentityType.PersonalIdentityCode}
                        >
                          Personal identity code
                        </Radio>
                        <Radio
                          {...register('registrationIdentityType')}
                          value={RegistrationIdentityType.TaxIdentityNumber}
                        >
                          Tax identity number
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  <FormControl id="registrationIdentity">
                    <Input {...register('registrationIdentity')} />
                  </FormControl>
                </Flex>
              </Flex>

              <Divider />

              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl id="countryOfBirthCode">
                  <FormLabel>Country where you were born</FormLabel>
                  <Input {...register('countryOfBirthCode')} />
                </FormControl>
                <FormControl id="districtOfOrigin">
                  <FormLabel>The district where you were born</FormLabel>
                  <Input {...register('districtOfOrigin')} />
                </FormControl>
              </Flex>

              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl id="nativeLanguage">
                  <FormLabel>Native language</FormLabel>
                  <Input {...register('nativeLanguage')} />
                </FormControl>
                <FormControl id="occupationCode">
                  <FormLabel>Occupation</FormLabel>
                  <Input {...register('occupationCode')} />
                </FormControl>
                <FormControl id="citizenship">
                  <FormLabel>Citizenship</FormLabel>
                  <Input {...register('citizenship')} />
                </FormControl>
              </Flex>

              <Divider />

              <FormControl id="addressInFinland">
                <FormLabel>Address in Finland</FormLabel>
                <Input {...register('addressInFinland')} />
              </FormControl>

              <FormControl id="address">
                <FormLabel>Address abroad</FormLabel>
                <Input {...register('address')} />
              </FormControl>

              <Divider />

              <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                <FormControl id="dateOfArrivalInFinland" w="auto">
                  <FormLabel>Date of arrival in Finland</FormLabel>
                  <Input
                    {...register('dateOfArrivalInFinland')}
                    placeholder={'E.g. 1.1.2023'}
                    type="date"
                  ></Input>
                </FormControl>
                <FormControl id="endDateOfStayInFinland" w="auto">
                  <FormLabel>
                    What is the latest estimated end date of your stay in
                    Finland?
                  </FormLabel>
                  <Input
                    {...register('endDateOfStayInFinland')}
                    placeholder={'E.g. 1.1.2023'}
                    type="date"
                  />
                </FormControl>
              </Flex>

              <Divider />

              <FormControl id="reasonForRecordingInformation">
                <FormLabel>
                  <Heading size={'sm'}>
                    The reason for recording information in the Population
                    Information System (Check the correct alternative and enter
                    the related additional information.)
                  </Heading>
                </FormLabel>
                <RadioGroup
                  defaultValue={InformationRegistrationReason.WorkingInFinland}
                >
                  <Stack direction={'column'}>
                    <Radio
                      {...register('reasonForRecordingInformation')}
                      value={InformationRegistrationReason.WorkingInFinland}
                    >
                      Working in Finland
                    </Radio>
                    <Radio
                      {...register('reasonForRecordingInformation')}
                      value={
                        InformationRegistrationReason.OperationOfTradeProfessionInFinland
                      }
                    >
                      Operation of a trade of profession in Finland
                    </Radio>
                    <Radio
                      {...register('reasonForRecordingInformation')}
                      value={InformationRegistrationReason.Other}
                    >
                      Other particular reason (please give details):
                    </Radio>
                    <Input
                      {...register('reasonForRecordingInformationDescription')}
                    />
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack>
              <Button
                colorScheme={'blue'}
                type={'submit'}
                leftIcon={<ViewIcon />}
                mt={8}
                w={{ base: 'full', md: 'auto' }}
                alignSelf="center"
              >
                Preview
              </Button>
            </Stack>
          </form>
        </fieldset>
      </Stack>
    </Stack>
  );
}
