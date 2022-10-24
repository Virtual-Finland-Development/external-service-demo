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
import {
  ProfileFormData,
  InformationRegistrationReason,
  RegistrationIdentityType,
  Sex,
} from '../../@types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ViewIcon } from '@chakra-ui/icons';
import { useModal } from '../../context/ModalContext/ModalContext';
import PdfForm from '../PdfForm/PdfForm';

const Divider = () => (
  <Center h="24px">
    <ChakraDivider color="white" />
  </Center>
);

interface Props {
  profileApiData: ProfileFormData | undefined;
}

export default function RegistrationDataForm(props: Props) {
  const { openModal, closeModal } = useModal();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProfileFormData>({
    mode: 'onSubmit',
    defaultValues: {
      registrationIdentityType: RegistrationIdentityType.PersonalIdentityCode,
      sex: Sex.Male,
      reasonForRecordingInformation:
        InformationRegistrationReason.WorkingInFinland,
    },
  });

  const doSubmit = useCallback(
    async (values: any) => {
      try {
        let payload: Partial<ProfileFormData>;
        const dirtyKeys = Object.keys(dirtyFields);
        payload = { ...values };
        const data = payload as ProfileFormData;
        openModal({
          title: 'Form Preview',
          content: <PdfForm profileData={payload as ProfileFormData}></PdfForm>,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [dirtyFields, openModal]
  );

  return (
    <Stack maxW="70ch" spacing={4}>
      <Box>
        <Heading color={'blue.900'}>Register foreigner</Heading>
        <Text color={'blue.900'}>
          Input information about your registration
        </Text>
      </Box>
      <Stack p={6} bg={'blue.700'} color={'white'} rounded="xl" boxShadow="lg">
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
                    defaultValue={RegistrationIdentityType.PersonalIdentityCode}
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
                  What is the latest estimated end date of your stay in Finland?
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
          <Button
            colorScheme={'blue'}
            type={'submit'}
            leftIcon={<ViewIcon />}
            mt={8}
            w="full"
          >
            Preview
          </Button>
        </form>
      </Stack>
    </Stack>
  );
  /* return (
    <Box>
      <Container
        marginBottom={4}
        p={4}
        bg={'whiteAlpha.300'}
        color={'blue.700'}
      >
        <Heading color={'blue.900'}>Register foreigner</Heading>
        <p>Input information about your registration</p>
      </Container>
      <Container p={4} bg={'blue.700'} color={'white'} borderRadius={8}>
        <form onSubmit={handleSubmit(doSubmit)}>
          <Flex direction={'column'} gap={5}>
            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormControl id="lastName">
                  <FormLabel>Family name</FormLabel>
                  <Input {...register('lastName')} />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="previousFamilyNames">
                  <FormLabel>Previous family names</FormLabel>
                  <Input {...register('previousFamilyNames')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormControl id="firstName">
                  <FormLabel>Given names</FormLabel>
                  <Input {...register('firstName')} type={'text'} />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="previousGivenName">
                  <FormLabel>Previous given names</FormLabel>
                  <Input {...register('previousGivenNames')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="dateOfBirth">
                  <FormLabel>Date of birth</FormLabel>
                  <Input
                    {...register('dateOfBirth')}
                    placeholder={'E.g. 1.1.2023'}
                  />
                  <FormHelperText color={'white'}>
                    Input date in d.m.yyyyy format
                  </FormHelperText>
                </FormControl>
              </Flex>
              <Flex direction={'column'}>
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
              <Flex direction={'column'}>
                <FormControl id="registrationIdentityType">
                  <FormLabel>
                    Personal identity code or Tax id no. in the country of
                    residence
                  </FormLabel>
                  <Stack direction={'column'}>
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
                    <Input {...register('registrationIdentity')} />
                  </Stack>
                </FormControl>
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormControl id="countryOfBirthCode">
                  <FormLabel>Country where you were born</FormLabel>
                  <Input {...register('countryOfBirthCode')} />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="districtOfOrigin">
                  <FormLabel>The district where you were born</FormLabel>
                  <Input {...register('districtOfOrigin')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="nativeLanguage">
                  <FormLabel>Native language</FormLabel>
                  <Input {...register('nativeLanguage')} />
                </FormControl>
              </Flex>
              <Flex direction={'column'}>
                <FormControl id="occupationCode">
                  <FormLabel>Occupation</FormLabel>
                  <Input {...register('occupationCode')} />
                </FormControl>
              </Flex>
              <Flex direction={'column'}>
                <FormControl id="citizenship">
                  <FormLabel>Citizenship</FormLabel>
                  <Input {...register('citizenship')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex direction={'column'}>
              <FormControl id="addressInFinland">
                <FormLabel>Address in Finland</FormLabel>
                <Input {...register('addressInFinland')} />
              </FormControl>
            </Flex>

            <Flex direction={'column'}>
              <FormControl id="address">
                <FormLabel>Address abroad</FormLabel>
                <Input {...register('address')} />
              </FormControl>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="dateOfArrivalInFinland">
                  <FormLabel>Date of arrival in Finland</FormLabel>
                  <Input
                    {...register('dateOfArrivalInFinland')}
                    placeholder={'E.g. 1.1.2023'}
                    type="date"
                  ></Input>
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'}>
                <FormControl id="endDateOfStayInFinland">
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
            </Flex>

            <Flex>
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
            </Flex>
            <Flex>
              <Button
                colorScheme={'blue'}
                type={'submit'}
                leftIcon={<ViewIcon />}
              >
                Preview
              </Button>
            </Flex>
          </Flex>
        </form>
      </Container>
    </Box>
  ); */
}
