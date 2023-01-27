import { CheckCircleIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
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
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// types
import {
  CountryOption,
  InformationRegistrationReason,
  LanguageOption,
  Occupation,
  OccupationOption,
  ProfileFormData,
  RegistrationIdentityType,
  Sex,
  UserProfile,
} from '../../@types';

// context
import { useAppContext } from '../../context/AppContext/AppContext';
import { useModal } from '../../context/ModalContext/ModalContext';

// components
import PdfForm from '../PdfForm/PdfForm';

function getCountryValue(list: CountryOption[], itemId: string) {
  if (!list) return undefined;
  return list.find(i => i.id === itemId)?.englishName || undefined;
}

function getOccupationsValues(
  list: OccupationOption[],
  userOccupations: Occupation[]
) {
  if (!list || !userOccupations) return undefined;

  return userOccupations
    .map(o => {
      const label =
        list.find(i => i.uri === o.escoIdentifier)?.prefLabel.en || '';
      return label;
    })
    .join(', ');
}

function getLanguageValue(list: LanguageOption[], itemId: string) {
  if (!list) return undefined;
  return list.find(i => i.id === itemId)?.englishName || undefined;
}

function formatAddress(addressObject: UserProfile['address']) {
  const { streetAddress, zipCode, city } = addressObject;
  let output = '';

  if (streetAddress) output = `${streetAddress}`;
  if (city) output += `, ${city}`;
  if (zipCode) output += ` ${zipCode}`;

  return output;
}

const Divider = () => (
  <Center h="24px">
    <ChakraDivider color="white" />
  </Center>
);

interface Props {
  fetchUserProfile: () => void;
  lists: {
    countries: CountryOption[];
    occupations: OccupationOption[];
    languages: LanguageOption[];
  };
  isLoading: boolean;
  isProfileDataUsed: boolean;
  isConsentGranted: boolean;
  redirectToConsentService: () => void;
  freshApprovedConsent: boolean;
  fetchStatus: () => void;
}

export default function RegistrationDataForm(props: Props) {
  const { userProfile } = useAppContext();
  const {
    isConsentGranted,
    redirectToConsentService,
    freshApprovedConsent,
    fetchStatus,
  } = props;

  const [isPdfSent, setIsPdfSent] = useState<boolean>(false);
  const { fetchUserProfile, lists, isLoading, isProfileDataUsed } = props;
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
   * Fetch profile automatically once user has given consent and is redirected back to the app
   */
  useEffect(() => {
    if (freshApprovedConsent) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, freshApprovedConsent]);

  /**
   * After user have given consent, reset the form with pre-defined values from user profile.
   */
  useEffect(() => {
    if (isConsentGranted && userProfile) {
      reset({
        ...userProfile,
        dateOfBirth: userProfile.dateOfBirth
          ? format(parseISO(userProfile.dateOfBirth), 'yyyy-MM-dd')
          : undefined,
        countryOfBirthCode: userProfile.countryOfBirthCode
          ? getCountryValue(lists.countries, userProfile.countryOfBirthCode)
          : undefined,
        citizenshipCode: userProfile.citizenshipCode
          ? getCountryValue(lists.countries, userProfile.citizenshipCode)
          : undefined,
        occupationsString: userProfile.occupations
          ? getOccupationsValues(lists.occupations, userProfile.occupations)
          : undefined,
        nativeLanguageCode: userProfile.nativeLanguageCode
          ? getLanguageValue(lists.languages, userProfile.nativeLanguageCode)
          : undefined,
        addressFormatted: userProfile.address
          ? formatAddress(userProfile.address)
          : undefined,
      });
    }
  }, [lists, isConsentGranted, userProfile, reset]);

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
              disableModalClose={isDisabled =>
                setModalCloseDisabled(isDisabled)
              }
              sendCallback={() => {
                closeModal();
                setIsPdfSent(true);
                fetchStatus();
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
    [closeModal, fetchStatus, openModal, setModalCloseDisabled]
  );

  /**
   * Handle modal open for asking 'immigrationDataConsent', before profile fetch.
   * If consent already given, user can deny the consent.
   */
  const handleConsentModalOpen = useCallback(() => {
    openModal({
      title: 'Pre-fill form with your profile',
      content: (
        <Stack spacing={6}>
          <Text>
            {!isConsentGranted
              ? 'We need your consent to access your profile data in Access to Finland service.'
              : 'You have previously given your consent to access your profile data in Access to Finland Service.'}
          </Text>
          <Stack spacing={6} direction={['column', 'row']}>
            {isConsentGranted && (
              <Button
                w="full"
                colorScheme="red"
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Warning',
                    description: 'Consent revoke not implemented yet',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                  });
                }}
              >
                Revoke consent
              </Button>
            )}
            <Button
              colorScheme="blue"
              w="full"
              onClick={() => {
                if (!isConsentGranted) {
                  redirectToConsentService();
                  sessionStorage.setItem('consentInitializedWithinApp', 'true');
                } else {
                  fetchUserProfile();
                }

                closeModal();
              }}
            >
              {!isConsentGranted ? 'Approve' : 'Pre-fill'}
            </Button>
          </Stack>
        </Stack>
      ),
    });
  }, [
    toast,
    closeModal,
    fetchUserProfile,
    isConsentGranted,
    openModal,
    redirectToConsentService,
  ]);

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
              colorScheme={isProfileDataUsed ? 'green' : 'blue'}
              onClick={handleConsentModalOpen}
              isLoading={isLoading}
              disabled={isLoading || isProfileDataUsed}
              {...(isProfileDataUsed && {
                leftIcon: <CheckIcon />,
              })}
            >
              {isProfileDataUsed
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
                                <Radio value="Male">Male</Radio>
                                <Radio value="Female">Female</Radio>
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
                    <FormControl id="occupationsString">
                      <FormLabel>Occupation</FormLabel>
                      <Input {...register('occupationsString')} />
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

                  <FormControl id="addressFormatted">
                    <FormLabel>Address abroad</FormLabel>
                    <Input {...register('addressFormatted')} />
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
