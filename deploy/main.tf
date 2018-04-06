provider "aws" {
  region = "ap-southeast-1"
}

variable "custom_ami" {}
variable "public_key" {}

resource "aws_default_vpc" "default" {}

resource "aws_instance" "instance" {
  ami                         = "${var.custom_ami}"
  key_name                    = "${aws_key_pair.instance_key.key_name}"
  instance_type               = "t2.micro"
  security_groups             = ["${aws_security_group.instance-sg.name}"]
  associate_public_ip_address = true

  tags {
    Env  = "prod"
    Name = "issuelabeler-bot-prod"
  }
}

resource "aws_security_group" "instance-sg" {
  name        = "instance-security-group"
  description = "Security group for production EC2 instances"
  vpc_id      = "${aws_default_vpc.default.id}"

  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 3000
    to_port     = 3000
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = -1
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "instance_key" {
  key_name   = "prod-instances"
  public_key = "${var.public_key}"
}

output "instance_public_ip" {
  value = "${aws_instance.instance.public_ip}"
}
