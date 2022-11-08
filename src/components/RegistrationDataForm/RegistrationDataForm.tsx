import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import {
  Box,
  Button,
  Center,
  Divider as ChakraDivider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';

// types
import {
  CountryOption,
  InformationRegistrationReason,
  LanguageOption,
  OccupationOption,
  ProfileFormData,
  RegistrationIdentityType,
  Sex,
} from '../../@types';

// context
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import PdfForm from '../PdfForm/PdfForm';

function getCountryValue(list: CountryOption[], itemId: string) {
  if (!list) return undefined;
  return list.find(i => i.id === itemId)?.englishName || undefined;
}

function getOccupationValue(list: OccupationOption[], itemId: string) {
  if (!list) return undefined;
  return list.find(i => i.id === itemId)?.name.en || undefined;
}

function getLanguageValue(list: LanguageOption[], itemId: string) {
  if (!list) return undefined;
  return list.find(i => i.id === itemId)?.englishName || undefined;
}

const Divider = () => (
  <Center h="24px">
    <ChakraDivider color="white" />
  </Center>
);

interface Props {
  profileApiData: Partial<ProfileFormData> | undefined;
  saveUserConsent: () => void;
  lists: {
    countries: CountryOption[];
    occupations: OccupationOption[];
    languages: LanguageOption[];
  };
  isLoading: boolean;
}

export default function RegistrationDataForm(props: Props) {
  const [isPdfSent, setIsPdfSent] = useState<boolean>(false);
  const { profileApiData, saveUserConsent, lists, isLoading } = props;
  const { openModal, closeModal, setModalCloseDisabled } = useModal();

  const { handleSubmit, register, reset, control, watch } =
    useForm<ProfileFormData>({
      mode: 'onSubmit',
      defaultValues: {
        registrationIdentityType: RegistrationIdentityType.PersonalIdentityCode,
        gender: Sex.Male,
        reasonForRecordingInformation:
          InformationRegistrationReason.WorkingInFinland,
      },
    });

  const { reasonForRecordingInformation } = watch();

  /**
   * After user have given consent, reset the form with pre-defined values from user profile.
   */
  useEffect(() => {
    if (profileApiData?.immigrationDataConsent) {
      reset({
        ...profileApiData,
        dateOfBirth: profileApiData.dateOfBirth
          ? format(parseISO(profileApiData.dateOfBirth), 'yyyy-MM-dd')
          : undefined,
        countryOfBirthCode: profileApiData.countryOfBirthCode
          ? getCountryValue(lists.countries, profileApiData.countryOfBirthCode)
          : undefined,
        citizenshipCode: profileApiData.citizenshipCode
          ? getCountryValue(lists.countries, profileApiData.citizenshipCode)
          : undefined,
        occupationCode: profileApiData.occupationCode
          ? getOccupationValue(lists.occupations, profileApiData.occupationCode)
          : undefined,
        nativeLanguageCode: profileApiData.nativeLanguageCode
          ? getLanguageValue(lists.languages, profileApiData.nativeLanguageCode)
          : undefined,
      });
    }
  }, [lists, profileApiData, reset]);

  const toast = useToast();

  /**
   * Handle form submit, open PDF preview.
   */
  const doSubmit = useCallback(
    async (values: any) => {
      try {
        openModal({
          title: 'Form Preview',
          content: (
            <PdfForm
              profileData={values as ProfileFormData}
              disableModalClose={() => setModalCloseDisabled(true)}
              sendCallback={() => {
                closeModal();
                setIsPdfSent(true);
                toast({
                  title: 'Registration form was sent successfully',
                  status: 'success',
                  position: 'top-right',
                  duration: 5000,
                  isClosable: true,
                });
              }}
            />
          ),
          useBodyPadding: false,
          size: '4xl',
        });
      } catch (e) {
        console.log(e);
      }
    },
    [closeModal, openModal, setModalCloseDisabled, toast]
  );

  /**
   * Handle user profile data consent ('immigrationDataConsent')
   */
  const handleConsent = useCallback(() => {
    openModal({
      title: 'Pre-fill form with your profile',
      content: (
        <Stack spacing={6}>
          <Text>
            We need your consent to access your profile data in Access to
            Finland service.
          </Text>
          <Button
            mt={6}
            colorScheme="blue"
            onClick={() => {
              saveUserConsent();
              closeModal();
            }}
          >
            Approve
          </Button>
        </Stack>
      ),
    });
  }, [closeModal, openModal, saveUserConsent]);

  return (
    <Box>
      {isPdfSent && (
        <Box textAlign="center" py={10}>
          <CheckCircleIcon boxSize="50px" color="green.500" />
          <Heading as="h2" size="xl" mt={4} mb={2}>
            Registration sent!
          </Heading>
          <Text color="gray.500">
            Your registration information has been sent successfully. You can
            close this window now.
          </Text>
        </Box>
      )}
      {!isPdfSent && (
        <Stack maxW="70ch" spacing={4}>
          <Flex
            alignItems="end"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Heading>Register foreigner</Heading>
              <Text>Input information about your registration</Text>
            </Box>
            <Button
              colorScheme={
                profileApiData?.immigrationDataConsent ? 'green' : 'blue'
              }
              onClick={handleConsent}
              isLoading={isLoading}
              disabled={isLoading || profileApiData?.immigrationDataConsent}
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
            border="1px"
            borderColor="blue.700"
            rounded="xl"
            bg="white"
            boxShadow="lg"
            position="relative"
          >
            <fieldset disabled={isLoading}>
              <form onSubmit={handleSubmit(doSubmit)}>
                <Stack spacing={4}>
                  <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                    <FormControl id="lastName">
                      <FormLabel>Family name</FormLabel>
                      <Input {...register('lastName')} />
                    </FormControl>
                    <FormControl id="previousFamilyNames">
                      <FormLabel>Previous family names</FormLabel>
                      <Input {...register('previousFamilyNames')} />
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
                        <FormHelperText>
                          Input date in d.m.yyyyy format
                        </FormHelperText>
                      </FormControl>
                      <FormControl id="gender">
                        <FormLabel>Sex</FormLabel>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              onChange={onChange}
                              value={value}
                              defaultValue={Sex.Male}
                            >
                              <Stack direction="row">
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                              </Stack>
                            </RadioGroup>
                          )}
                        />
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
                              value={
                                RegistrationIdentityType.PersonalIdentityCode
                              }
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
                    <FormControl id="nativeLanguageCode">
                      <FormLabel>Native language</FormLabel>
                      <Input {...register('nativeLanguageCode')} />
                    </FormControl>
                    <FormControl id="occupationCode">
                      <FormLabel>Occupation</FormLabel>
                      <Input {...register('occupationCode')} />
                    </FormControl>
                    <FormControl id="citizenshipCode">
                      <FormLabel>Citizenship</FormLabel>
                      <Input {...register('citizenshipCode')} />
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
                        Information System (Check the correct alternative and
                        enter the related additional information.)
                      </Heading>
                    </FormLabel>
                    <RadioGroup
                      defaultValue={
                        InformationRegistrationReason.WorkingInFinland
                      }
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
                        {reasonForRecordingInformation ===
                          InformationRegistrationReason.Other && (
                          <Input
                            {...register(
                              'reasonForRecordingInformationDescription'
                            )}
                          />
                        )}
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
      )}
    </Box>
  );
}
