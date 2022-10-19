import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import {
  IdentityType,
  InformationRegistrationReason,
  ProfileData,
  Sex,
} from '../../@types';

interface Props {
  profileApiData: ProfileData | undefined;
}

export default function RegistrationDataForm(props: Props) {
  return (
    <Box bg={'tomato'} w={'100%'} color={'white'}>
      <Container marginBottom={4} p={4} bg={'whiteAlpha.300'}>
        <Heading>Register foreigner</Heading>
        <p>Input information about your registration</p>
      </Container>
      <Container p={4} bg={'whiteAlpha.300'}>
        <FormControl isRequired>
          <Flex direction={'column'} gap={5}>
            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormLabel>Family name</FormLabel>
                <Input />
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormLabel>Previous family names</FormLabel>
                <Input />
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'} grow={1}>
                <FormLabel>Given names</FormLabel>
                <Input
                  type={'text'}
                  value={props.profileApiData?.Lastname ?? ''}
                />
              </Flex>
              <Spacer />
              <Flex direction={'column'} grow={1}>
                <FormLabel>Previous given names</FormLabel>
                <Input />
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormLabel>Date of birth</FormLabel>
                <Input />
              </Flex>
              <Flex direction={'column'}>
                <FormLabel>Sex</FormLabel>
                <RadioGroup>
                  <Stack direction={'column'}>
                    <Radio value={Sex.Male}>Male</Radio>
                    <Radio value={Sex.Female}>Female</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
              <Flex direction={'column'}>
                <FormLabel>
                  Personal identity code or Tax id no. in the country of
                  residence
                </FormLabel>
                <Stack direction={'column'}>
                  <RadioGroup>
                    <Stack direction={'row'}>
                      <Radio value={IdentityType.PersonalIdentityCode}>
                        Personal identity code
                      </Radio>
                      <Radio value={IdentityType.TaxIdentityNumber}>
                        Tax identity number
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Input />
                </Stack>
              </Flex>
            </Flex>

            <Flex>
              <Flex direction={'column'}>
                <FormLabel>Country where you were born</FormLabel>
                <Input />
              </Flex>
              <Spacer />
              <Flex direction={'column'}>
                <FormLabel>The district where you were born</FormLabel>
                <Input />
              </Flex>
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormLabel>Native language</FormLabel>
                <Input />
              </Flex>
              <Flex direction={'column'}>
                <FormLabel>Occupation</FormLabel>
                <Input />
              </Flex>
              <Flex direction={'column'}>
                <FormLabel>Citizenship</FormLabel>
                <Input />
              </Flex>
            </Flex>

            <Flex direction={'column'}>
              <FormLabel>Address in Finland</FormLabel>
              <Input />
            </Flex>

            <Flex direction={'column'}>
              <FormLabel>Address abroad</FormLabel>
              <Input />
            </Flex>

            <Flex gap={2}>
              <Flex direction={'column'}>
                <FormLabel>Date of arrival in Finland</FormLabel>
                <Input></Input>
              </Flex>
              <Spacer />
              <Flex direction={'column'}>
                <FormLabel>
                  What is the latest estimated end date of your stay in Finland?
                </FormLabel>
                <Input />
              </Flex>
            </Flex>

            <Heading size={'sm'}>
              The reason for recording information in the Population Information
              System (Check the correct alternative and enterthe related
              additional information.)
            </Heading>

            <Flex>
              <Box>
                <RadioGroup>
                  <Stack direction={'column'}>
                    <Radio
                      value={InformationRegistrationReason.WorkingInFinland}
                    >
                      Working in Finland
                    </Radio>
                    <Radio
                      value={
                        InformationRegistrationReason.OperationOfTradeProfessionInFinland
                      }
                    >
                      Operation of a trade of profession in Finland
                    </Radio>
                    <Radio value={InformationRegistrationReason.Other}>
                      Other particular reason (please give details):
                    </Radio>
                    <Input></Input>
                  </Stack>
                </RadioGroup>
              </Box>
            </Flex>
            <Flex>
              <Button colorScheme={'blue'} type={'submit'}>
                Preview
              </Button>
            </Flex>
          </Flex>
        </FormControl>
      </Container>
    </Box>
  );
}
