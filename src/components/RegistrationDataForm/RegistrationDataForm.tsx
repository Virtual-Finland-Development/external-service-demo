import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import {
  InformationRegistrationReason,
  ProfileData,
  ProfileFormData,
  RegistrationIdentityType,
  Sex,
} from '../../@types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ViewIcon } from '@chakra-ui/icons';
import { useModal } from '../../context/ModalContext/ModalContext';
import PdfForm from '../PdfForm/PdfForm';

interface Props {
  profileApiData: ProfileData | undefined;
}

export default function RegistrationDataForm(props: Props) {
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
      RegistrationIdentityType: RegistrationIdentityType.PersonalIdentityCode,
      Sex: Sex.Male,
      ReasonForRecordingInformation:
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
    [dirtyFields]
  );

  const { openModal, closeModal } = useModal();

  return (
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
                <FormControl id="familyName">
                  <FormLabel>Family name</FormLabel>
                  <Input
                    {...register('FamilyName')}
                    defaultValue={props.profileApiData?.Lastname}
                  />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="previousFamilyNames">
                  <FormLabel>Previous family names</FormLabel>
                  <Input {...register('PreviousFamilyNames')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormControl id="givenName">
                  <FormLabel>Given names</FormLabel>
                  <Input {...register('GivenName')} type={'text'} />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="previousGivenName">
                  <FormLabel>Previous given names</FormLabel>
                  <Input {...register('PreviousGivenNames')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="dateOfBirth">
                  <FormLabel>Date of birth</FormLabel>
                  <Input
                    {...register('DateOfBirth')}
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
                  <RadioGroup>
                    <Stack direction={'column'}>
                      <Radio {...register('Sex')} value={Sex.Male}>
                        Male
                      </Radio>
                      <Radio {...register('Sex')} value={Sex.Female}>
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
                    <RadioGroup>
                      <Stack direction={'row'}>
                        <Radio
                          {...register('RegistrationIdentityType')}
                          value={RegistrationIdentityType.PersonalIdentityCode}
                        >
                          Personal identity code
                        </Radio>
                        <Radio
                          {...register('RegistrationIdentityType')}
                          value={RegistrationIdentityType.TaxIdentityNumber}
                        >
                          Tax identity number
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    <Input {...register('RegistrationIdentity')} />
                  </Stack>
                </FormControl>
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormControl id="countryOfOrigin">
                  <FormLabel>Country where you were born</FormLabel>
                  <Input {...register('CountryOfOrigin')} />
                </FormControl>
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormControl id="districtOfOrigin">
                  <FormLabel>The district where you were born</FormLabel>
                  <Input {...register('DistrictOfOrigin')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="nativeLanguage">
                  <FormLabel>Native language</FormLabel>
                  <Input {...register('NativeLanguage')} />
                </FormControl>
              </Flex>
              <Flex direction={'column'}>
                <FormControl id="occupation">
                  <FormLabel>Occupation</FormLabel>
                  <Input {...register('Occupation')} />
                </FormControl>
              </Flex>
              <Flex direction={'column'}>
                <FormControl id="citizenship">
                  <FormLabel>Citizenship</FormLabel>
                  <Input {...register('Citizenship')} />
                </FormControl>
              </Flex>
            </Flex>

            <Flex direction={'column'}>
              <FormControl id="addressInFinland">
                <FormLabel>Address in Finland</FormLabel>
                <Input {...register('AddressInFinland')} />
              </FormControl>
            </Flex>

            <Flex direction={'column'}>
              <FormControl id="addressAbroad">
                <FormLabel>Address abroad</FormLabel>
                <Input {...register('AddressAbroad')} />
              </FormControl>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormControl id="dateOfArrivalInFinland">
                  <FormLabel>Date of arrival in Finland</FormLabel>
                  <Input
                    {...register('DateOfArrivalInFinland')}
                    placeholder={'E.g. 1.1.2023'}
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
                    {...register('EndDateOfStayInFinland')}
                    placeholder={'E.g. 1.1.2023'}
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
                <RadioGroup>
                  <Stack direction={'column'}>
                    <Radio
                      {...register('ReasonForRecordingInformation')}
                      value={InformationRegistrationReason.WorkingInFinland}
                    >
                      Working in Finland
                    </Radio>
                    <Radio
                      {...register('ReasonForRecordingInformation')}
                      value={
                        InformationRegistrationReason.OperationOfTradeProfessionInFinland
                      }
                    >
                      Operation of a trade of profession in Finland
                    </Radio>
                    <Radio
                      {...register('ReasonForRecordingInformation')}
                      value={InformationRegistrationReason.Other}
                    >
                      Other particular reason (please give details):
                    </Radio>
                    <Input
                      {...register('ReasonForRecordingInformationDescription')}
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
  );
}
