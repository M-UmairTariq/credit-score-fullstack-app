import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    useToast,
    Container,
    Heading,
  } from "@chakra-ui/react"
  import { useState, ChangeEvent, FormEvent } from "react"
  
  import { OpenAPI } from "../client"
  
  // Define schema for the form data
  

  
  const CreditScorePrediction = () => {
    const [formData, setFormData] = useState({
      age: "",
      job: "",
      marital: "",
      education: "",
      default: "",
      balance: "",
      housing: "",
      loan: "",
      contact: "",
      day: "",
      month: "",
      duration: "",
      campaign: "",
      pdays: "",
      previous: "",
      poutcome: "",
    })
    const toast = useToast()
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/predict/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await OpenAPI.TOKEN}`,
          },
          body: JSON.stringify(formData),
        })
  
        if (!response.ok) {
          const errorDetail = await response.json()
          throw new Error(errorDetail.detail || "Unknown error occurred")
        }
  
        const result = await response.json()
        toast({
          title: "Prediction Result",
          description: `Prediction of Model: ${result.prediction}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Credit Score Prediction
        </Heading>
        <Box
          minH="100vh"
          bgImage="url('https://images.unsplash.com/photo-1592204688047-87b01484cc6f')"
          bgSize="cover"
          bgPosition="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box bg="gray.800" p={8} rounded="lg" shadow="2xl" w="full" maxW="lg">
            <VStack as="form" spacing={4} onSubmit={handleSubmit}>
              <FormControl id="age" isRequired>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  bg="gray.900"
                  borderColor="gray.600"
                  focusBorderColor="blue.500"
                />
              </FormControl>
              
              {/* Repeat similar blocks for all other form fields */}
              <FormControl id="job" isRequired>
                <FormLabel>Job</FormLabel>
                <Select
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  bg="gray.900"
                  borderColor="gray.600"
                  focusBorderColor="blue.500"
                >
                  <option value="">Select your job</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="services">Services</option>
                  {/* Add other options here */}
                </Select>
              </FormControl>
  
              {/* Add all the other fields similarly */}
              
              <Button type="submit" colorScheme="blue" w="full" mt={6}>
                Predict
              </Button>
            </VStack>
          </Box>
        </Box>
      </Container>
    )
  }
  
  export default CreditScorePrediction
  